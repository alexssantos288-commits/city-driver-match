export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json
          id: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          state: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          state: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          state?: string
        }
        Relationships: []
      }
      driver_documents: {
        Row: {
          created_at: string
          doc_type: Database["public"]["Enums"]["document_type"]
          driver_id: string
          file_path: string
          id: string
          notes: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["review_status"]
        }
        Insert: {
          created_at?: string
          doc_type: Database["public"]["Enums"]["document_type"]
          driver_id: string
          file_path: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["review_status"]
        }
        Update: {
          created_at?: string
          doc_type?: Database["public"]["Enums"]["document_type"]
          driver_id?: string
          file_path?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["review_status"]
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_private: {
        Row: {
          cnh_category: string
          cnh_number: string
          cpf: string
          driver_id: string
          updated_at: string
        }
        Insert: {
          cnh_category: string
          cnh_number: string
          cpf: string
          driver_id: string
          updated_at?: string
        }
        Update: {
          cnh_category?: string
          cnh_number?: string
          cpf?: string
          driver_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_private_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_profiles: {
        Row: {
          approved_at: string | null
          availability: Database["public"]["Enums"]["availability_status"]
          base_fare: number | null
          bio: string | null
          created_at: string
          experience_years: number | null
          id: string
          price_per_km: number | null
          pricing_mode: Database["public"]["Enums"]["pricing_mode"]
          pricing_notes: string | null
          rating_avg: number
          rating_count: number
          rejection_reason: string | null
          services: string[]
          status: Database["public"]["Enums"]["driver_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          availability?: Database["public"]["Enums"]["availability_status"]
          base_fare?: number | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          id: string
          price_per_km?: number | null
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          pricing_notes?: string | null
          rating_avg?: number
          rating_count?: number
          rejection_reason?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["driver_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          availability?: Database["public"]["Enums"]["availability_status"]
          base_fare?: number | null
          bio?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          price_per_km?: number | null
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          pricing_notes?: string | null
          rating_avg?: number
          rating_count?: number
          rejection_reason?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["driver_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_service_areas: {
        Row: {
          area_id: string
          driver_id: string
        }
        Insert: {
          area_id: string
          driver_id: string
        }
        Update: {
          area_id?: string
          driver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_service_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_service_areas_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          driver_id: string
          passenger_id: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          passenger_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          passenger_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passenger_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      passenger_profiles: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passenger_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city_id: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          privacy_accepted_at: string | null
          suspended: boolean
          terms_accepted_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city_id?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          privacy_accepted_at?: string | null
          suspended?: boolean
          terms_accepted_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          privacy_accepted_at?: string | null
          suspended?: boolean
          terms_accepted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          driver_id: string
          id: string
          passenger_id: string
          ride_request_id: string
          score: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          driver_id: string
          id?: string
          passenger_id: string
          ride_request_id: string
          score: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          driver_id?: string
          id?: string
          passenger_id?: string
          ride_request_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passenger_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_ride_request_id_fkey"
            columns: ["ride_request_id"]
            isOneToOne: true
            referencedRelation: "ride_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_events: {
        Row: {
          actor_id: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["ride_status"] | null
          id: string
          payload: Json
          ride_request_id: string
          to_status: Database["public"]["Enums"]["ride_status"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["ride_status"] | null
          id?: string
          payload?: Json
          ride_request_id: string
          to_status: Database["public"]["Enums"]["ride_status"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["ride_status"] | null
          id?: string
          payload?: Json
          ride_request_id?: string
          to_status?: Database["public"]["Enums"]["ride_status"]
        }
        Relationships: [
          {
            foreignKeyName: "ride_events_ride_request_id_fkey"
            columns: ["ride_request_id"]
            isOneToOne: false
            referencedRelation: "ride_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          agreed_price: number | null
          cancelled_by: string | null
          created_at: string
          decline_reason: string | null
          dest_address: string
          dest_lat: number | null
          dest_lng: number | null
          driver_id: string
          expires_at: string
          id: string
          luggage: string | null
          notes: string | null
          origin_address: string
          origin_lat: number | null
          origin_lng: number | null
          passenger_id: string
          passengers: number
          pricing_mode: Database["public"]["Enums"]["pricing_mode"]
          quoted_price: number | null
          responded_at: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["ride_status"]
          updated_at: string
        }
        Insert: {
          agreed_price?: number | null
          cancelled_by?: string | null
          created_at?: string
          decline_reason?: string | null
          dest_address: string
          dest_lat?: number | null
          dest_lng?: number | null
          driver_id: string
          expires_at: string
          id?: string
          luggage?: string | null
          notes?: string | null
          origin_address: string
          origin_lat?: number | null
          origin_lng?: number | null
          passenger_id: string
          passengers?: number
          pricing_mode: Database["public"]["Enums"]["pricing_mode"]
          quoted_price?: number | null
          responded_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["ride_status"]
          updated_at?: string
        }
        Update: {
          agreed_price?: number | null
          cancelled_by?: string | null
          created_at?: string
          decline_reason?: string | null
          dest_address?: string
          dest_lat?: number | null
          dest_lng?: number | null
          driver_id?: string
          expires_at?: string
          id?: string
          luggage?: string | null
          notes?: string | null
          origin_address?: string
          origin_lat?: number | null
          origin_lng?: number | null
          passenger_id?: string
          passengers?: number
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          quoted_price?: number | null
          responded_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["ride_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_requests_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passenger_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_areas: {
        Row: {
          active: boolean
          city_id: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          city_id: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          city_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_areas_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          category: Database["public"]["Enums"]["vehicle_category"]
          color: string
          created_at: string
          driver_id: string
          id: string
          is_active: boolean
          make: string
          model: string
          plate: string
          seats: number
          status: Database["public"]["Enums"]["review_status"]
          year: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["vehicle_category"]
          color: string
          created_at?: string
          driver_id: string
          id?: string
          is_active?: boolean
          make: string
          model: string
          plate: string
          seats?: number
          status?: Database["public"]["Enums"]["review_status"]
          year: number
        }
        Update: {
          category?: Database["public"]["Enums"]["vehicle_category"]
          color?: string
          created_at?: string
          driver_id?: string
          id?: string
          is_active?: boolean
          make?: string
          model?: string
          plate?: string
          seats?: number
          status?: Database["public"]["Enums"]["review_status"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_area: {
        Args: { p_city: string; p_name: string }
        Returns: string
      }
      admin_list_users: {
        Args: never
        Returns: {
          city_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          roles: string[]
          suspended: boolean
        }[]
      }
      admin_review_document: {
        Args: {
          p_doc: string
          p_notes?: string
          p_status: Database["public"]["Enums"]["review_status"]
        }
        Returns: undefined
      }
      admin_review_driver: {
        Args: {
          p_driver: string
          p_reason?: string
          p_status: Database["public"]["Enums"]["driver_status"]
        }
        Returns: undefined
      }
      admin_set_setting: {
        Args: { p_key: string; p_value: Json }
        Returns: undefined
      }
      admin_set_user_suspended: {
        Args: { p_reason?: string; p_suspended: boolean; p_user: string }
        Returns: undefined
      }
      admin_upsert_city: {
        Args: { p_active?: boolean; p_name: string; p_state: string }
        Returns: string
      }
      cancel_ride: {
        Args: { p_reason?: string; p_ride: string }
        Returns: undefined
      }
      create_ride_request: {
        Args: {
          p_dest: string
          p_dest_lat: number
          p_dest_lng: number
          p_driver: string
          p_luggage: string
          p_notes: string
          p_origin: string
          p_origin_lat: number
          p_origin_lng: number
          p_passengers: number
          p_scheduled_for: string
        }
        Returns: string
      }
      driver_advance_ride: {
        Args: {
          p_ride: string
          p_to: Database["public"]["Enums"]["ride_status"]
        }
        Returns: undefined
      }
      driver_public_ratings: {
        Args: { p_driver: string }
        Returns: {
          comment: string
          created_at: string
          passenger_first_name: string
          score: number
        }[]
      }
      driver_respond_ride: {
        Args: {
          p_action: string
          p_price?: number
          p_reason?: string
          p_ride: string
        }
        Returns: Database["public"]["Enums"]["ride_status"]
      }
      expire_ride_requests: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      marketplace_drivers: {
        Args: {
          p_area?: string
          p_available_only?: boolean
          p_category?: Database["public"]["Enums"]["vehicle_category"]
          p_city?: string
          p_driver?: string
          p_min_rating?: number
          p_query?: string
          p_service?: string
        }
        Returns: {
          areas: string[]
          availability: Database["public"]["Enums"]["availability_status"]
          avatar_url: string
          base_fare: number
          bio: string
          city_id: string
          city_name: string
          city_state: string
          driver_id: string
          experience_years: number
          full_name: string
          price_per_km: number
          pricing_mode: Database["public"]["Enums"]["pricing_mode"]
          pricing_notes: string
          rating_avg: number
          rating_count: number
          services: string[]
          vehicle_category: Database["public"]["Enums"]["vehicle_category"]
          vehicle_color: string
          vehicle_make: string
          vehicle_model: string
          vehicle_seats: number
          vehicle_year: number
        }[]
      }
      notify_user: {
        Args: {
          _body: string
          _link: string
          _title: string
          _type: string
          _user: string
        }
        Returns: undefined
      }
      passenger_confirm_ride: { Args: { p_ride: string }; Returns: undefined }
      rate_ride: {
        Args: { p_comment?: string; p_ride: string; p_score: number }
        Returns: undefined
      }
      submit_driver_for_review: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "driver" | "passenger"
      availability_status: "online" | "offline" | "busy" | "unavailable"
      document_type:
        | "cnh"
        | "crlv"
        | "antecedentes"
        | "comprovante_residencia"
        | "foto_perfil"
        | "outro"
      driver_status: "pending" | "approved" | "rejected" | "suspended"
      pricing_mode: "fixed" | "quote"
      review_status: "pending" | "approved" | "rejected"
      ride_status:
        | "PENDING"
        | "QUOTED"
        | "ACCEPTED"
        | "CONFIRMED"
        | "DRIVER_ARRIVING"
        | "ARRIVED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "DECLINED"
        | "CANCELLED"
        | "EXPIRED"
      vehicle_category:
        | "economico"
        | "conforto"
        | "executivo"
        | "suv"
        | "van"
        | "acessivel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "driver", "passenger"],
      availability_status: ["online", "offline", "busy", "unavailable"],
      document_type: [
        "cnh",
        "crlv",
        "antecedentes",
        "comprovante_residencia",
        "foto_perfil",
        "outro",
      ],
      driver_status: ["pending", "approved", "rejected", "suspended"],
      pricing_mode: ["fixed", "quote"],
      review_status: ["pending", "approved", "rejected"],
      ride_status: [
        "PENDING",
        "QUOTED",
        "ACCEPTED",
        "CONFIRMED",
        "DRIVER_ARRIVING",
        "ARRIVED",
        "IN_PROGRESS",
        "COMPLETED",
        "DECLINED",
        "CANCELLED",
        "EXPIRED",
      ],
      vehicle_category: [
        "economico",
        "conforto",
        "executivo",
        "suv",
        "van",
        "acessivel",
      ],
    },
  },
} as const
