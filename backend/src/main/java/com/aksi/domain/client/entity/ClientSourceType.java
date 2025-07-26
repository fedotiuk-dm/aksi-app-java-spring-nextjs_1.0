package com.aksi.domain.client.entity;

/** How the client found out about the dry cleaning service */
public enum ClientSourceType {
  REFERRAL, // Referrals from other clients
  ADVERTISING, // Advertising (any type)
  SOCIAL_MEDIA, // Social networks
  WEBSITE, // Company website
  WALKING_BY, // Walked by the shop
  REPEAT_CUSTOMER, // Regular customer
  OTHER // Other source (details in sourceOther field)
}
