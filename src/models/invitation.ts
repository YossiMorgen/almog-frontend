export interface Invitation {
  id: number;
  invitation_token: string;
  invited_email: string;
  invited_roles: number[];
  invited_at: string;
  expires_at: string;
  tenant_id: string;
  tenant_name: string;
  tenant_domain?: string;
  invitor_name: string;
}

export interface AcceptInvitationRequest {
  invitation_token: string;
  tenant_id: string;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  profile_picture_url?: string;
  phone?: string;
  language: 'en' | 'he';
}
