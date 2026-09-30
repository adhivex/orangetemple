export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      collection_temples: {
        Row: {
          collection_id: string
          display_order: number
          temple_id: string
        }
        Insert: {
          collection_id: string
          display_order?: number
          temple_id: string
        }
        Update: {
          collection_id?: string
          display_order?: number
          temple_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'collection_temples_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'collection_temples_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          image_alt: string | null
          image_public_id: string | null
          image_url: string | null
          introduction: string | null
          name: string
          published_at: string | null
          slug: string
          status: Database['public']['Enums']['content_status']
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          image_alt?: string | null
          image_public_id?: string | null
          image_url?: string | null
          introduction?: string | null
          name: string
          published_at?: string | null
          slug: string
          status?: Database['public']['Enums']['content_status']
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_alt?: string | null
          image_public_id?: string | null
          image_url?: string | null
          introduction?: string | null
          name?: string
          published_at?: string | null
          slug?: string
          status?: Database['public']['Enums']['content_status']
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      deities: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          is_featured: boolean
          name: string
          name_native: string | null
          slug: string
          tradition: Database['public']['Enums']['tradition'] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          is_featured?: boolean
          name: string
          name_native?: string | null
          slug: string
          tradition?: Database['public']['Enums']['tradition'] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          name?: string
          name_native?: string | null
          slug?: string
          tradition?: Database['public']['Enums']['tradition'] | null
          updated_at?: string
        }
        Relationships: []
      }
      festivals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          recurrence_note: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          recurrence_note?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          recurrence_note?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      nearby_places: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          related_temple_id: string | null
          temple_id: string
          type: Database['public']['Enums']['nearby_place_type']
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          related_temple_id?: string | null
          temple_id: string
          type: Database['public']['Enums']['nearby_place_type']
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          related_temple_id?: string | null
          temple_id?: string
          type?: Database['public']['Enums']['nearby_place_type']
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'nearby_places_related_temple_id_fkey'
            columns: ['related_temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'nearby_places_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      related_collections: {
        Row: {
          collection_id: string
          display_order: number
          related_collection_id: string
        }
        Insert: {
          collection_id: string
          display_order?: number
          related_collection_id: string
        }
        Update: {
          collection_id?: string
          display_order?: number
          related_collection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'related_collections_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'related_collections_related_collection_id_fkey'
            columns: ['related_collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
        ]
      }
      rituals: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          temple_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          temple_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          temple_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rituals_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      slug_redirects: {
        Row: {
          created_at: string
          id: string
          old_slug: string
          temple_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          old_slug: string
          temple_id: string
        }
        Update: {
          created_at?: string
          id?: string
          old_slug?: string
          temple_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'slug_redirects_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      states: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_union_territory: boolean
          name: string
          region: Database['public']['Enums']['region']
          slug: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_union_territory?: boolean
          name: string
          region: Database['public']['Enums']['region']
          slug: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_union_territory?: boolean
          name?: string
          region?: Database['public']['Enums']['region']
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      temple_festivals: {
        Row: {
          description: string | null
          display_order: number
          festival_id: string
          temple_id: string
        }
        Insert: {
          description?: string | null
          display_order?: number
          festival_id: string
          temple_id: string
        }
        Update: {
          description?: string | null
          display_order?: number
          festival_id?: string
          temple_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'temple_festivals_festival_id_fkey'
            columns: ['festival_id']
            isOneToOne: false
            referencedRelation: 'festivals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'temple_festivals_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      temple_images: {
        Row: {
          alt_text: string
          blur_data_url: string | null
          caption: string | null
          created_at: string
          credit: string
          display_order: number
          height: number
          id: string
          image_type: Database['public']['Enums']['image_type']
          is_placeholder: boolean
          license_type: Database['public']['Enums']['license_type']
          public_id: string
          source_url: string | null
          temple_id: string
          updated_at: string
          url: string
          width: number
        }
        Insert: {
          alt_text: string
          blur_data_url?: string | null
          caption?: string | null
          created_at?: string
          credit: string
          display_order?: number
          height: number
          id?: string
          image_type: Database['public']['Enums']['image_type']
          is_placeholder?: boolean
          license_type: Database['public']['Enums']['license_type']
          public_id: string
          source_url?: string | null
          temple_id: string
          updated_at?: string
          url: string
          width: number
        }
        Update: {
          alt_text?: string
          blur_data_url?: string | null
          caption?: string | null
          created_at?: string
          credit?: string
          display_order?: number
          height?: number
          id?: string
          image_type?: Database['public']['Enums']['image_type']
          is_placeholder?: boolean
          license_type?: Database['public']['Enums']['license_type']
          public_id?: string
          source_url?: string | null
          temple_id?: string
          updated_at?: string
          url?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: 'temple_images_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      temple_references: {
        Row: {
          accessed_at: string | null
          citation: string | null
          created_at: string
          display_order: number
          id: string
          source_type: Database['public']['Enums']['reference_source_type']
          temple_id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          accessed_at?: string | null
          citation?: string | null
          created_at?: string
          display_order?: number
          id?: string
          source_type: Database['public']['Enums']['reference_source_type']
          temple_id: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          accessed_at?: string | null
          citation?: string | null
          created_at?: string
          display_order?: number
          id?: string
          source_type?: Database['public']['Enums']['reference_source_type']
          temple_id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'temple_references_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: false
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      temple_visit_info: {
        Row: {
          best_time_to_visit: string | null
          created_at: string
          dress_code: string | null
          entry_rules: string | null
          how_to_reach: string | null
          id: string
          last_verified_at: string | null
          nearest_airport: string | null
          nearest_railway: string | null
          notes: string | null
          photography_rules: string | null
          seasonal_access: string | null
          temple_id: string
          timings: string | null
          updated_at: string
          verification_source_url: string | null
        }
        Insert: {
          best_time_to_visit?: string | null
          created_at?: string
          dress_code?: string | null
          entry_rules?: string | null
          how_to_reach?: string | null
          id?: string
          last_verified_at?: string | null
          nearest_airport?: string | null
          nearest_railway?: string | null
          notes?: string | null
          photography_rules?: string | null
          seasonal_access?: string | null
          temple_id: string
          timings?: string | null
          updated_at?: string
          verification_source_url?: string | null
        }
        Update: {
          best_time_to_visit?: string | null
          created_at?: string
          dress_code?: string | null
          entry_rules?: string | null
          how_to_reach?: string | null
          id?: string
          last_verified_at?: string | null
          nearest_airport?: string | null
          nearest_railway?: string | null
          notes?: string | null
          photography_rules?: string | null
          seasonal_access?: string | null
          temple_id?: string
          timings?: string | null
          updated_at?: string
          verification_source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'temple_visit_info_temple_id_fkey'
            columns: ['temple_id']
            isOneToOne: true
            referencedRelation: 'temples'
            referencedColumns: ['id']
          },
        ]
      }
      temples: {
        Row: {
          address: string | null
          alternate_names: string[]
          architecture: string | null
          architecture_style: string | null
          city: string
          coordinates_source: string | null
          country: string
          created_at: string
          deity_id: string
          district: string | null
          estimated_period: string | null
          history: string | null
          id: string
          latitude: number | null
          legend: string | null
          location_note: string | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          name_native: string | null
          official_website: string | null
          overview: string
          published_at: string | null
          search_text: string
          short_description: string
          short_name: string | null
          significance: string
          slug: string
          state_id: string
          status: Database['public']['Enums']['content_status']
          updated_at: string
        }
        Insert: {
          address?: string | null
          alternate_names?: string[]
          architecture?: string | null
          architecture_style?: string | null
          city: string
          coordinates_source?: string | null
          country?: string
          created_at?: string
          deity_id: string
          district?: string | null
          estimated_period?: string | null
          history?: string | null
          id?: string
          latitude?: number | null
          legend?: string | null
          location_note?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          name_native?: string | null
          official_website?: string | null
          overview: string
          published_at?: string | null
          search_text: string
          short_description: string
          short_name?: string | null
          significance: string
          slug: string
          state_id: string
          status?: Database['public']['Enums']['content_status']
          updated_at?: string
        }
        Update: {
          address?: string | null
          alternate_names?: string[]
          architecture?: string | null
          architecture_style?: string | null
          city?: string
          coordinates_source?: string | null
          country?: string
          created_at?: string
          deity_id?: string
          district?: string | null
          estimated_period?: string | null
          history?: string | null
          id?: string
          latitude?: number | null
          legend?: string | null
          location_note?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          name_native?: string | null
          official_website?: string | null
          overview?: string
          published_at?: string | null
          search_text?: string
          short_description?: string
          short_name?: string | null
          significance?: string
          slug?: string
          state_id?: string
          status?: Database['public']['Enums']['content_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'temples_deity_id_fkey'
            columns: ['deity_id']
            isOneToOne: false
            referencedRelation: 'deities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'temples_state_id_fkey'
            columns: ['state_id']
            isOneToOne: false
            referencedRelation: 'states'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_temples: {
        Args: {
          collection_slug?: string
          deity_slug?: string
          page_number?: number
          page_size?: number
          region_code?: Database['public']['Enums']['region']
          search_query?: string
          state_slug?: string
        }
        Returns: Json
      }
    }
    Enums: {
      content_status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      image_type: 'HERO' | 'GALLERY' | 'THUMBNAIL' | 'OG'
      license_type: 'OWNED' | 'CC0' | 'CC_BY' | 'CC_BY_SA' | 'PUBLIC_DOMAIN' | 'LICENSED' | 'OTHER'
      nearby_place_type: 'TEMPLE' | 'SHRINE' | 'GHAT' | 'NATURAL' | 'HERITAGE' | 'OTHER'
      reference_source_type:
        'OFFICIAL_TEMPLE' | 'GOVERNMENT' | 'ACADEMIC' | 'TRADITIONAL_TEXT' | 'NEWS' | 'OTHER'
      region: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'CENTRAL' | 'NORTHEAST'
      tradition: 'SHAIVA' | 'VAISHNAVA' | 'SHAKTA' | 'OTHER'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_status: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      image_type: ['HERO', 'GALLERY', 'THUMBNAIL', 'OG'],
      license_type: ['OWNED', 'CC0', 'CC_BY', 'CC_BY_SA', 'PUBLIC_DOMAIN', 'LICENSED', 'OTHER'],
      nearby_place_type: ['TEMPLE', 'SHRINE', 'GHAT', 'NATURAL', 'HERITAGE', 'OTHER'],
      reference_source_type: [
        'OFFICIAL_TEMPLE',
        'GOVERNMENT',
        'ACADEMIC',
        'TRADITIONAL_TEXT',
        'NEWS',
        'OTHER',
      ],
      region: ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTHEAST'],
      tradition: ['SHAIVA', 'VAISHNAVA', 'SHAKTA', 'OTHER'],
    },
  },
} as const
