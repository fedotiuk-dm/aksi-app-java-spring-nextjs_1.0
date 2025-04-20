package com.aksi.domain.client.entity;

/**
 * Перелік джерел залучення клієнтів
 */
public enum ClientSource {
    /**
     * За рекомендацією
     */
    REFERRAL,
    
    /**
     * Соціальні мережі
     */
    SOCIAL_MEDIA,
    
    /**
     * Інстаграм
     */
    INSTAGRAM,
    
    /**
     * Пошук в Google
     */
    GOOGLE,
    
    /**
     * Реклама
     */
    ADVERTISEMENT,
    
    /**
     * Клієнт повернувся
     */
    RETURNING,
    
    /**
     * Випадковий клієнт (проходив повз)
     */
    WALK_IN,
    
    /**
     * Інше джерело
     */
    OTHER
} 