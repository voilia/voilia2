export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_capabilities: {
        Row: {
          agent_id: string | null
          capabilities: Json | null
          created_at: string | null
          id: string
          max_tokens: number | null
          supported_languages: string[] | null
          supported_llms: string[] | null
          supported_modes: string[] | null
          temperature: number | null
          tool_names: string[] | null
          uses_tools: boolean | null
        }
        Insert: {
          agent_id?: string | null
          capabilities?: Json | null
          created_at?: string | null
          id?: string
          max_tokens?: number | null
          supported_languages?: string[] | null
          supported_llms?: string[] | null
          supported_modes?: string[] | null
          temperature?: number | null
          tool_names?: string[] | null
          uses_tools?: boolean | null
        }
        Update: {
          agent_id?: string | null
          capabilities?: Json | null
          created_at?: string | null
          id?: string
          max_tokens?: number | null
          supported_languages?: string[] | null
          supported_llms?: string[] | null
          supported_modes?: string[] | null
          temperature?: number | null
          tool_names?: string[] | null
          uses_tools?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_capabilities_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_capabilities_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_capabilities_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_capabilities_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agent_chain_steps: {
        Row: {
          agent_id: string | null
          chain_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          room_id: string | null
          step_order: number | null
        }
        Insert: {
          agent_id?: string | null
          chain_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          room_id?: string | null
          step_order?: number | null
        }
        Update: {
          agent_id?: string | null
          chain_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          room_id?: string | null
          step_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_chain_steps_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_chain_steps_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_chain_steps_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_chain_steps_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_chain_steps_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_feedback: {
        Row: {
          agent_id: string | null
          approved: boolean | null
          created_at: string | null
          execution_id: string | null
          feedback_weight: number | null
          id: string
          rating: number | null
          rejected_reason: string | null
          style_tags: string[] | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          approved?: boolean | null
          created_at?: string | null
          execution_id?: string | null
          feedback_weight?: number | null
          id?: string
          rating?: number | null
          rejected_reason?: string | null
          style_tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          approved?: boolean | null
          created_at?: string | null
          execution_id?: string | null
          feedback_weight?: number | null
          id?: string
          rating?: number | null
          rejected_reason?: string | null
          style_tags?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_feedback_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_feedback_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "prompt_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_pairings: {
        Row: {
          agent_id: string | null
          id: string
          paired_agent_id: string | null
          reason: string | null
        }
        Insert: {
          agent_id?: string | null
          id?: string
          paired_agent_id?: string | null
          reason?: string | null
        }
        Update: {
          agent_id?: string | null
          id?: string
          paired_agent_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_pairings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_pairings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_pairings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_pairings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_pairings_paired_agent_id_fkey"
            columns: ["paired_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_pairings_paired_agent_id_fkey"
            columns: ["paired_agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_pairings_paired_agent_id_fkey"
            columns: ["paired_agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_pairings_paired_agent_id_fkey"
            columns: ["paired_agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agent_personas: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          example_prompt: string | null
          id: string
          is_public: boolean | null
          name: string
          style_config: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          example_prompt?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          style_config?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          example_prompt?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          style_config?: Json | null
        }
        Relationships: []
      }
      agent_prompts: {
        Row: {
          agent_id: string | null
          id: string
          prompt: string
        }
        Insert: {
          agent_id?: string | null
          id?: string
          prompt: string
        }
        Update: {
          agent_id?: string | null
          id?: string
          prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agent_tag_links: {
        Row: {
          agent_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          agent_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          agent_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_tag_links_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tag_links_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tag_links_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_tag_links_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "agent_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tags: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      agent_template_links: {
        Row: {
          agent_id: string
          relevance_score: number | null
          template_id: string
        }
        Insert: {
          agent_id: string
          relevance_score?: number | null
          template_id: string
        }
        Update: {
          agent_id?: string
          relevance_score?: number | null
          template_id?: string
        }
        Relationships: []
      }
      agent_usage_instructions: {
        Row: {
          agent_id: string | null
          context: string
          id: string
          instruction: string
        }
        Insert: {
          agent_id?: string | null
          context: string
          id?: string
          instruction: string
        }
        Update: {
          agent_id?: string | null
          context?: string
          id?: string
          instruction?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_usage_instructions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_usage_instructions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_usage_instructions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_usage_instructions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agent_versions: {
        Row: {
          agent_id: string | null
          changelog: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          system_prompt: string | null
          version: string | null
        }
        Insert: {
          agent_id?: string | null
          changelog?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          system_prompt?: string | null
          version?: string | null
        }
        Update: {
          agent_id?: string | null
          changelog?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          system_prompt?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      agents: {
        Row: {
          agent_type: string | null
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_public: boolean | null
          name: string
          persona: string | null
          supported_languages: string[] | null
          system_prompt: string | null
          updated_at: string | null
        }
        Insert: {
          agent_type?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          persona?: string | null
          supported_languages?: string[] | null
          system_prompt?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_type?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          persona?: string | null
          supported_languages?: string[] | null
          system_prompt?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      model_responses: {
        Row: {
          agent_id: string | null
          created_at: string | null
          duration_ms: number | null
          execution_id: string | null
          id: string
          model_name: string | null
          prompt: string | null
          response: string | null
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          execution_id?: string | null
          id?: string
          model_name?: string | null
          prompt?: string | null
          response?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          execution_id?: string | null
          id?: string
          model_name?: string | null
          prompt?: string | null
          response?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "model_responses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_responses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_responses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "model_responses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "model_responses_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "prompt_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      preview_blocks: {
        Row: {
          agent_id: string | null
          approved: boolean | null
          created_at: string | null
          data: Json | null
          id: string
          room_id: string | null
          type: string | null
        }
        Insert: {
          agent_id?: string | null
          approved?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          room_id?: string | null
          type?: string | null
        }
        Update: {
          agent_id?: string | null
          approved?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          room_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preview_blocks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preview_blocks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preview_blocks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "preview_blocks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "preview_blocks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_errors: {
        Row: {
          created_at: string | null
          error_message: string | null
          error_type: string
          execution_id: string
          id: number
          input_data: Json | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          error_type: string
          execution_id: string
          id?: number
          input_data?: Json | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          error_type?: string
          execution_id?: string
          id?: number
          input_data?: Json | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_profiles: {
        Row: {
          inferred_roles: string[] | null
          project_id: string
          recommended_agent_ids: string[] | null
          recommended_room_template_ids: string[] | null
          summary: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          inferred_roles?: string[] | null
          project_id: string
          recommended_agent_ids?: string[] | null
          recommended_room_template_ids?: string[] | null
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          inferred_roles?: string[] | null
          project_id?: string
          recommended_agent_ids?: string[] | null
          recommended_room_template_ids?: string[] | null
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_profiles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_suggestions: {
        Row: {
          created_at: string | null
          generated_by: string | null
          id: number
          project_id: string | null
          suggested_agent_ids: string[] | null
          suggested_template_ids: string[] | null
        }
        Insert: {
          created_at?: string | null
          generated_by?: string | null
          id?: never
          project_id?: string | null
          suggested_agent_ids?: string[] | null
          suggested_template_ids?: string[] | null
        }
        Update: {
          created_at?: string | null
          generated_by?: string | null
          id?: never
          project_id?: string | null
          suggested_agent_ids?: string[] | null
          suggested_template_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "project_suggestions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_deleted: boolean | null
          is_personal: boolean | null
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          is_personal?: boolean | null
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          is_personal?: boolean | null
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prompt_execution_agents: {
        Row: {
          agent_id: string | null
          created_at: string | null
          execution_id: string | null
          id: string
          is_shadow: boolean | null
          output: string | null
          step_order: number | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          execution_id?: string | null
          id?: string
          is_shadow?: boolean | null
          output?: string | null
          step_order?: number | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          execution_id?: string | null
          id?: string
          is_shadow?: boolean | null
          output?: string | null
          step_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_execution_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_execution_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_execution_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "prompt_execution_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "prompt_execution_agents_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "prompt_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_executions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          input: string | null
          room_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          input?: string | null
          room_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          input?: string | null
          room_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_executions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_agent_personas: {
        Row: {
          agent_id: string | null
          applied_config: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          persona_id: string | null
          room_id: string | null
        }
        Insert: {
          agent_id?: string | null
          applied_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          persona_id?: string | null
          room_id?: string | null
        }
        Update: {
          agent_id?: string | null
          applied_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          persona_id?: string | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_agent_personas_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_agent_personas_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_agent_personas_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "room_agent_personas_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "room_agent_personas_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "agent_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_agent_personas_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_agents: {
        Row: {
          agent_id: string | null
          created_at: string | null
          execution_order: number | null
          id: string
          is_visible: boolean | null
          room_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          execution_order?: number | null
          id?: string
          is_visible?: boolean | null
          room_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          execution_order?: number | null
          id?: string
          is_visible?: boolean | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "room_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "room_agents_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_messages: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          message_text: string | null
          room_id: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          message_text?: string | null
          room_id: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          message_text?: string | null
          room_id?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "room_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_mode_settings: {
        Row: {
          agent_merge_strategy: string | null
          allow_agent_reordering: boolean | null
          approval_required: boolean | null
          created_at: string | null
          execution_strategy: string | null
          id: string
          mode: string
          room_id: string | null
          smartbar_behavior: Json | null
        }
        Insert: {
          agent_merge_strategy?: string | null
          allow_agent_reordering?: boolean | null
          approval_required?: boolean | null
          created_at?: string | null
          execution_strategy?: string | null
          id?: string
          mode: string
          room_id?: string | null
          smartbar_behavior?: Json | null
        }
        Update: {
          agent_merge_strategy?: string | null
          allow_agent_reordering?: boolean | null
          approval_required?: boolean | null
          created_at?: string | null
          execution_strategy?: string | null
          id?: string
          mode?: string
          room_id?: string | null
          smartbar_behavior?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "room_mode_settings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_suggestions: {
        Row: {
          accepted: boolean | null
          created_at: string | null
          id: string
          project_id: string | null
          reason: string | null
          suggested_id: string | null
          suggestion_type: string | null
          user_id: string | null
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          reason?: string | null
          suggested_id?: string | null
          suggestion_type?: string | null
          user_id?: string | null
        }
        Update: {
          accepted?: boolean | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          reason?: string | null
          suggested_id?: string | null
          suggestion_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_suggestions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      room_template_groups: {
        Row: {
          description: string | null
          id: string
          label: string | null
          tags: string[] | null
          template_ids: string[] | null
          use_case: string | null
        }
        Insert: {
          description?: string | null
          id: string
          label?: string | null
          tags?: string[] | null
          template_ids?: string[] | null
          use_case?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          label?: string | null
          tags?: string[] | null
          template_ids?: string[] | null
          use_case?: string | null
        }
        Relationships: []
      }
      room_templates: {
        Row: {
          category: string | null
          description: string | null
          group_id: string | null
          icon: string | null
          id: number
          suggested_for_profiles: string[] | null
          suggested_tags: string[] | null
          tags: string[] | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          group_id?: string | null
          icon?: string | null
          id?: never
          suggested_for_profiles?: string[] | null
          suggested_tags?: string[] | null
          tags?: string[] | null
        }
        Update: {
          category?: string | null
          description?: string | null
          group_id?: string | null
          icon?: string | null
          id?: never
          suggested_for_profiles?: string[] | null
          suggested_tags?: string[] | null
          tags?: string[] | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          name: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_log: {
        Row: {
          agent_id: string | null
          cost_estimate: number | null
          created_at: string | null
          execution_id: string | null
          id: string
          project_id: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          cost_estimate?: number | null
          created_at?: string | null
          execution_id?: string | null
          id?: string
          project_id?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          cost_estimate?: number | null
          created_at?: string | null
          execution_id?: string | null
          id?: string
          project_id?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "usage_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "usage_log_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "prompt_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_example_prompts: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          language: string | null
          prompt: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          prompt: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_example_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_example_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_example_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "user_example_prompts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          content_stats: Json | null
          created_at: string | null
          id: number
          interaction_type: string
          project_id: string | null
          response_time: number | null
          room_id: string | null
          success: boolean | null
          user_id: string
        }
        Insert: {
          content_stats?: Json | null
          created_at?: string | null
          id?: number
          interaction_type: string
          project_id?: string | null
          response_time?: number | null
          room_id?: string | null
          success?: boolean | null
          user_id: string
        }
        Update: {
          content_stats?: Json | null
          created_at?: string | null
          id?: number
          interaction_type?: string
          project_id?: string | null
          response_time?: number | null
          room_id?: string | null
          success?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          language: string | null
          model_preferences: Json | null
          updated_at: string | null
          usage_limits: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          language?: string | null
          model_preferences?: Json | null
          updated_at?: string | null
          usage_limits?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          language?: string | null
          model_preferences?: Json | null
          updated_at?: string | null
          usage_limits?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      vault_entries: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          room_id: string | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          room_id?: string | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vault_entries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_updates_log: {
        Row: {
          approved: boolean | null
          created_at: string | null
          id: string
          notes: string | null
          user_id: string | null
          vault_entry_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
          vault_entry_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
          vault_entry_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vault_updates_log_vault_entry_id_fkey"
            columns: ["vault_entry_id"]
            isOneToOne: false
            referencedRelation: "vault_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_agent_versions: {
        Row: {
          agent_id: string | null
          changelog: string | null
          created_at: string | null
          created_by: string | null
          id: string | null
          is_active: boolean | null
          system_prompt: string | null
          version: string | null
        }
        Insert: {
          agent_id?: string | null
          changelog?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string | null
          is_active?: boolean | null
          system_prompt?: string | null
          version?: string | null
        }
        Update: {
          agent_id?: string | null
          changelog?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string | null
          is_active?: boolean | null
          system_prompt?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "public_agents_with_tags"
            referencedColumns: ["agent_id"]
          },
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "room_agents_with_metadata"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      public_agents_with_meta: {
        Row: {
          agent_type: string | null
          capabilities: Json[] | null
          changelog: string | null
          color: string | null
          description: string | null
          icon: string | null
          id: string | null
          name: string | null
          system_prompt: string | null
          tags: string[] | null
          version: string | null
        }
        Relationships: []
      }
      public_agents_with_tags: {
        Row: {
          agent_id: string | null
          agent_type: string | null
          description: string | null
          is_public: boolean | null
          name: string | null
          tags: string[] | null
        }
        Relationships: []
      }
      room_agents_with_metadata: {
        Row: {
          agent_id: string | null
          agent_type: string | null
          color: string | null
          icon: string | null
          name: string | null
          room_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_agents_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_token_quota: {
        Args: { p_project_id: string; p_tokens_needed: number }
        Returns: boolean
      }
      create_agent_with_prompt: {
        Args: {
          _name: string
          _description: string
          _system_prompt: string
          _persona: string
          _agent_type: string
          _supported_languages?: string[]
          _icon?: string
          _color?: string
          _is_public?: boolean
        }
        Returns: string
      }
      create_project_with_owner: {
        Args: {
          _name: string
          _description?: string
          _color?: string
          _owner_id?: string
        }
        Returns: string
      }
      create_room_with_agents: {
        Args: {
          _project_id: string
          _name: string
          _description: string
          _color: string
          _agent_ids?: string[]
        }
        Returns: string
      }
      get_personalized_agents: {
        Args: { p_user_id: string; p_room_id: string }
        Returns: {
          agent_id: string
          relevance_score: number
        }[]
      }
      get_user_style_preferences: {
        Args: { p_user_id: string }
        Returns: {
          style_type: string
          style_value: string
          confidence: number
        }[]
      }
      increment_token_usage: {
        Args: { p_project_id: string; p_tokens_used: number }
        Returns: undefined
      }
      log_workflow_execution: {
        Args: { p_workflow_id: string }
        Returns: undefined
      }
      reset_monthly_quotas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      safely_add_project_member: {
        Args: { p_project_id: string; p_user_id: string; p_role?: string }
        Returns: string
      }
      sync_agent_prompt_from_version: {
        Args: { _agent_id: string }
        Returns: undefined
      }
      update_room_members: {
        Args: { _room_id: string; _user_ids: string[] }
        Returns: undefined
      }
      update_room_with_agents: {
        Args: { _room_id: string; _agent_ids: string[] }
        Returns: undefined
      }
    }
    Enums: {
      project_role: "owner" | "admin" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      project_role: ["owner", "admin", "member", "viewer"],
    },
  },
} as const
