export interface Invitation {
  id: number;
  invited_email: string;
  invited_roles: number[];
  invited_at: string;
  expires_at: string;
  is_approved: boolean;
  tenant_name: string;
  tenant_domain?: string;
  invitor_name: string;
}

export interface AcceptInvitationRequest {
  invitation_token: string;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  profile_picture_url?: string;
  phone?: string;
  language: 'en' | 'he';
}
