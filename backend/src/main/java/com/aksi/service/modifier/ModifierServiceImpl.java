package com.aksi.service.modifier;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.constants.ModifierCodes;
import com.aksi.domain.cart.CartItemModifier;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

/** Implementation of ModifierService with predefined modifiers */
@Slf4j
@Service
public class ModifierServiceImpl implements ModifierService {

  private final Map<String, ModifierConfig> modifiers = new HashMap<>();

  @PostConstruct
  public void initModifiers() {
    // General modifiers (available for all categories)
    modifiers.put(
        ModifierCodes.CHILD_ITEMS,
        new ModifierConfig("Дитячі речі (до 30 розміру)", "PERCENTAGE", -70)); // 30% of base price
    modifiers.put(
        ModifierCodes.MANUAL_CLEANING, new ModifierConfig("Ручна чистка", "PERCENTAGE", 20));
    modifiers.put(
        ModifierCodes.VERY_DIRTY,
        new ModifierConfig("Дуже забруднені речі", "PERCENTAGE", 50)); // Can be 20-100%
    modifiers.put(
        ModifierCodes.URGENT_CLEANING,
        new ModifierConfig("Термінова чистка", "PERCENTAGE", 50)); // Can be 50-100%

    // Textile modifiers
    modifiers.put(
        ModifierCodes.FUR_COLLAR,
        new ModifierConfig("Чистка виробів з хутряними комірами та манжетами", "PERCENTAGE", 30));
    modifiers.put(
        ModifierCodes.WATER_REPELLENT,
        new ModifierConfig("Нанесення водовідштовхуючого покриття", "PERCENTAGE", 30));
    modifiers.put(
        ModifierCodes.SILK_FABRIC,
        new ModifierConfig(
            "Чистка виробів із натурального шовку, атласу, шифону", "PERCENTAGE", 50));
    modifiers.put(
        ModifierCodes.COMBINED_LEATHER_TEXTILE,
        new ModifierConfig("Чистка комбінованих виробів (шкіра+текстиль)", "PERCENTAGE", 100));
    modifiers.put(
        ModifierCodes.LARGE_TOYS,
        new ModifierConfig("Ручна чистка великих м'яких іграшок", "PERCENTAGE", 100));
    modifiers.put(
        ModifierCodes.SEW_BUTTONS,
        new ModifierConfig("Пришивання гудзиків", "FIXED", 500)); // 5 UAH per button
    modifiers.put(
        ModifierCodes.BLACK_WHITE_COLORS,
        new ModifierConfig("Чистка виробів чорного та світлих тонів", "PERCENTAGE", 20));
    modifiers.put(
        ModifierCodes.WEDDING_DRESS_TRAIN,
        new ModifierConfig("Чистка весільної сукні зі шлейфом", "PERCENTAGE", 30));

    // Leather modifiers
    modifiers.put(
        ModifierCodes.IRON_LEATHER,
        new ModifierConfig("Прасування шкіряних виробів", "PERCENTAGE", 70));
    modifiers.put(
        ModifierCodes.LEATHER_WATER_REPELLENT,
        new ModifierConfig("Нанесення водовідштовхуючого покриття на шкіру", "PERCENTAGE", 30));
    modifiers.put(
        ModifierCodes.DYE_AFTER_OUR_CLEAN,
        new ModifierConfig("Фарбування (після нашої чистки)", "PERCENTAGE", 50));
    modifiers.put(
        ModifierCodes.DYE_AFTER_OTHER_CLEAN,
        new ModifierConfig("Фарбування (після чистки деінде)", "PERCENTAGE", 100));
    modifiers.put(
        ModifierCodes.LEATHER_WITH_INSERTS,
        new ModifierConfig("Чистка шкіряних виробів із вставками", "PERCENTAGE", 30));
    modifiers.put(
        ModifierCodes.PEARL_COATING,
        new ModifierConfig("Нанесення перламутрового покриття", "PERCENTAGE", 30));
    modifiers.put(
        ModifierCodes.SHEEPSKIN_SYNTHETIC_FUR,
        new ModifierConfig("Чистка натуральних дублянок на штучному хутрі", "PERCENTAGE", -20));
    modifiers.put(
        ModifierCodes.MANUAL_LEATHER,
        new ModifierConfig("Ручна чистка виробів зі шкіри", "PERCENTAGE", 30));

    log.info("Initialized {} modifiers", modifiers.size());
  }

  @Override
  public CartItemModifier getModifierByCode(String modifierCode) {
    ModifierConfig config = modifiers.get(modifierCode);
    if (config == null) {
      log.warn("Unknown modifier code: {}", modifierCode);
      return null;
    }

    CartItemModifier modifier = new CartItemModifier();
    modifier.setCode(modifierCode);
    modifier.setName(config.name());
    modifier.setType(config.type());
    modifier.setValue(config.value());

    return modifier;
  }

  @Override
  public boolean modifierExists(String modifierCode) {
    return modifiers.containsKey(modifierCode);
  }

  private record ModifierConfig(String name, String type, Integer value) {}
}
