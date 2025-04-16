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
            foreignKeyName: "agent_feedback_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "prompt_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_versions: {
        Row: {
          agent_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          system_prompt: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          system_prompt?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          system_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_versions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          system_prompt: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          system_prompt?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
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
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          message_text?: string | null
          room_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          message_text?: string | null
          room_id?: string
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
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
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
      [_ in never]: never
    }
    Functions: {
      check_token_quota: {
        Args: { p_project_id: string; p_tokens_needed: number }
        Returns: boolean
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
