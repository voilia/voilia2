
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 50;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;
      maxOpacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.2;
        this.opacitySpeed = Math.random() * 0.01 + 0.003;
        this.maxOpacity = Math.random() * 0.2 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulsating opacity effect
        this.opacity += this.opacitySpeed;
        
        if (this.opacity >= this.maxOpacity || this.opacity <= 0) {
          this.opacitySpeed = -this.opacitySpeed;
        }

        // Boundary checking
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const color = isDark 
          ? `rgba(149, 128, 255, ${this.opacity})` 
          : `rgba(90, 70, 180, ${this.opacity * 0.7})`;
          
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    // Define createParticles function BEFORE it's used in resizeCanvas
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    // Full size canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGradientBackground = () => {
      const colors = isDark 
        ? { 
            start: 'rgba(25, 25, 35, 1)', 
            mid: 'rgba(32, 32, 45, 1)', 
            end: 'rgba(20, 20, 30, 1)' 
          }
        : { 
            start: 'rgba(248, 250, 255, 1)', 
            mid: 'rgba(238, 242, 255, 1)', 
            end: 'rgba(245, 247, 255, 1)' 
          };

      // Create a radial gradient
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      gradient.addColorStop(0, colors.mid);
      gradient.addColorStop(0.5, colors.start);
      gradient.addColorStop(1, colors.end);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const addNoise = () => {
      // Add subtle noise texture
      const noiseOpacity = isDark ? 0.015 : 0.02;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 10;
        if (noise < 0.5) {
          data[i] = data[i] + noise;
          data[i+1] = data[i+1] + noise;
          data[i+2] = data[i+2] + noise;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    const drawShimmerLines = () => {
      // Add subtle glowing lines
      const lineCount = 3;
      const lineColor = isDark 
        ? 'rgba(149, 128, 255, 0.03)' 
        : 'rgba(90, 70, 180, 0.02)';
        
      for (let i = 0; i < lineCount; i++) {
        const y = (canvas.height / (lineCount + 1)) * (i + 1);
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 100 + Math.sin(Date.now() * 0.0005) * 50;
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGradientBackground();
      drawShimmerLines();
      
      // Uncomment if you want the noise texture, but be careful as it can affect performance
      // addNoise();
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Draw connection lines between nearby particles
      ctx.strokeStyle = isDark ? 'rgba(149, 128, 255, 0.03)' : 'rgba(90, 70, 180, 0.02)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 transition-opacity duration-500"
      style={{ opacity: 0.8 }}
    />
  );
};

export default AnimatedBackground;
