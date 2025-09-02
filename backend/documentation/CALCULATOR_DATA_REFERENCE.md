# 📊 **ДОВІДНИК ДАНИХ ДЛЯ КАЛЬКУЛЯТОРА GAME SERVICES**

## 🎯 **ОСНОВНІ ДАНІ ДЛЯ РОЗРАХУНКІВ**

### **Типи розрахунків:**

1. **CONDITIONAL_CALCULATION** - умовні розрахунки з перевірками
2. **DIVISION_CALCULATION** - розрахунки з діленням
3. **MULTIPLICATION_WITH_REFERENCE** - множення з посиланнями на інші комірки
4. **SUM_CALCULATION** - сумування значень

---

## 💰 **МОДИФІКАТОРИ ЦІН**

### **Основні модифікатори:**

- **EXPRESS_SERVICE** - швидке виконання (+50% до ціни)
- **PREMIUM_ACCOUNT** - преміум акаунт (+$5)
- **PLACEMENT_MATCHES** - placement матчі (+$15)
- **BOOST_MODIFIER** - загальний модифікатор бусту
- **DIVISION_BOOST** - буст дивізіонів
- **WIN_BOOST** - буст перемог

### **Додаткові модифікатори:**

- **MENTOR_QUEST_BOOST** - буст квестів ментора (EFT)
- **GEAR_BOOST** - буст екіпіровки (WOW)
- **VENARI_REPUTATION_BOOST** - буст репутації Venari (WOW DF)
- **DUNGEON_COMPLETION** - завершення данжів (+30%)
- **ACHIEVEMENT_UNLOCK** - розблокування досягнень

---

## 🎮 **ТИПИ ПОСЛУГ ПО ІГРАХ**

### **World of Warcraft:**

- **Level** - підйом рівня персонажа
- **PVP** - PVP рейтингові ігри
- **Gear Boost** - буст екіпіровки до 200 ilvl
- **Profession** - розвиток професій
- **Reputation** - буст репутації

### **Call of Duty:**

- **Vanguard Rank Boosting** - буст рангу в Vanguard
- **Cold War Level Boosting** - підйом рівня в Cold War
- **Modern Warfare Rank Boosting** - буст рангу в Modern Warfare
- **Battle Royale Wins** - перемоги в Warzone
- **Weapon Leveling** - прокачка зброї
- **Camouflage** - камуфляжі

### **Apex Legends:**

- **Division Boost** - буст дивізіонів
- **Kill Boost** - буст вбивств (x100, x1000)
- **Win Boost** - буст перемог
- **Achievement Badges** - значки досягнень
- **Leveling** - підйом рівня

### **League of Legends:**

- **Solo Rank Boosting** - сольний буст рангу
- **Duo Boosting** - дуо буст
- **Placement Games** - placement ігри
- **Division Boosting** - буст дивізіонів
- **Win Boost** - буст перемог

### **Escape from Tarkov:**

- **Leveling** - підйом рівня
- **Mentor Quest Boost** - буст квестів ментора
- **Weapon Leveling** - прокачка зброї
- **Special Tasks** - спеціальні завдання

### **Final Fantasy XIV:**

- **Primary Job Leveling** - прокачка основної професії
- **Secondary Job Leveling** - прокачка вторинної професії
- **Disciples of the Hand** - крафтинг професії
- **Disciples of the Land** - gathering професії

### **Guild Wars 2:**

- **Character Leveling** - підйом рівня персонажа
- **PVP** - PVP ігри
- **Map Completion** - завершення мап
- **Achievement Points** - очки досягнень

### **New World:**

- **Character Leveling** - підйом рівня
- **Weapon Leveling** - прокачка зброї
- **Profession Leveling** - розвиток професій
- **Territory Control** - контроль територій

### **Overwatch:**

- **Ranked Boosting** - буст рейтингу
- **Solo Division Boosting** - сольний буст дивізіонів
- **Duo Division Boosting** - дуо буст дивізіонів
- **Endorsement Leveling** - прокачка endorsement

### **Valorant:**

- **Rank Division Boosting** - буст дивізіонів рангу
- **Net Wins** - чисті перемоги
- **Placement Matches** - placement матчі
- **Radiant Grind** - дорога до Radiant

### **Lost Ark:**

- **Character Leveling** - підйом рівня
- **Guardian Raids** - рейди з Guardian
- **Abyss Dungeons** - данжі Abyss
- **Una Tasks** - завдання Una

---

## 🏆 **РАНГИ ТА ДІВІЗІОНИ**

### **Apex Legends:**

- Bronze IV, Bronze III, Bronze II, Bronze I
- Silver IV, Silver III, Silver II, Silver I
- Gold IV, Gold III, Gold II, Gold I
- Platinum IV, Platinum III, Platinum II, Platinum I
- Diamond IV, Diamond III, Diamond II, Diamond I
- Master, Predator

### **League of Legends:**

- Iron IV, Iron III, Iron II, Iron I
- Bronze IV, Bronze III, Bronze II, Bronze I
- Silver IV, Silver III, Silver II, Silver I
- Gold IV, Gold III, Gold II, Gold I
- Platinum IV, Platinum III, Platinum II, Platinum I
- Diamond IV, Diamond III, Diamond II, Diamond I
- Master, Grandmaster, Challenger

### **Overwatch:**

- Bronze (0-375, 375-750, 750-1125, 1125-1500)
- Silver (1500-1625, 1625-1750, 1750-1875, 1875-2000)
- Gold (2000-2125, 2125-2250, 2250-2375, 2375-2500)
- Platinum (2500-2625, 2625-2750, 2750-2750, 2750-2875)
- Diamond (2875-3000, 3000-3125, 3125-3250, 3250-3375)
- Master, Grandmaster

### **Valorant:**

- Iron I, Iron II, Iron III
- Bronze I, Bronze II, Bronze III
- Silver I, Silver II, Silver III
- Gold I, Gold II, Gold III
- Platinum I, Platinum II, Platinum III
- Diamond I, Diamond II, Diamond III
- Ascendant I, Ascendant II, Ascendant III
- Immortal I, Immortal II, Immortal III
- Radiant

---

## 🔢 **МАТЕМАТИЧНІ ФОРМУЛИ**

### **Базові формули розрахунків:**

- `basePrice + (levelDiff * pricePerLevel)` - лінійний розрахунок
- `basePrice + (levelDiff * pricePerLevel) * multiplier` - з множником
- `SUM(range) * pricePerUnit` - сумування діапазону
- `IF(condition, true_value, false_value)` - умовний розрахунок

### **Складні формули:**

- **Apex RP Calculation**: `SUM(S3/(U4-U3))` - розрахунок RP для дивізіонів
- **OW Division Boost**: `SUM(U3-U2)*T2` - буст дивізіонів з SR
- **FFXIV Secondary**: `SUM(O2/2)` - половина вартості для secondary job
- **Conditional Discounts**: `if(C3="", "", C3/$N$47)` - умовні знижки

---

## 📈 **КОЕФІЦІЄНТИ ТА МНОЖНИКИ**

### **Часові коефіцієнти:**

- **Express Service**: 1.5x (50% надбавка)
- **Premium Account**: +$5 фіксована надбавка
- **Placement Matches**: +$15 за placement

### **Рівневі коефіцієнти:**

- **01-05**: базова ціна \* 4 (за 4 рівні)
- **05-10**: базова ціна \* 5 (за 5 рівнів)
- **10-15**: базова ціна \* 5 (за 5 рівнів)

### **Складність коефіцієнти:**

- **Easy**: 1.0x (базова ціна)
- **Medium**: 1.2x (+20%)
- **Hard**: 1.5x (+50%)
- **Expert**: 2.0x (+100%)

---

## 🎲 **СПЕЦІАЛЬНІ РОЗРАХУНКИ**

### **Battle Royale (Warzone, Fortnite):**

- Wins with One Booster
- Wins with Two Boosters
- Wins with Three Boosters

### **Achievement Systems:**

- Kill Boost x 100
- Kill Boost x 1000
- Capture the Winter Express (3, 15, 75 times)
- Mentor Quest completion

### **Profession Systems:**

- Weapon Leveling
- Character Leveling
- Reputation Grinding
- Territory Control

---

## 💡 **ПРАВИЛА ВАЛІДАЦІЇ**

### **Обов'язкові поля:**

- Game Type (WOW, COD, Apex, etc.)
- Service Type (Level, Rank, Win, etc.)
- From Level/From Rank
- To Level/To Rank

### **Бізнес правила:**

- To Level > From Level (для leveling)
- Valid Rank progression (Bronze → Silver → Gold)
- Service availability (не всі послуги доступні для всіх ігор)

### **Технічні обмеження:**

- Максимальна різниця рівнів: 50
- Мінімальна ціна: $1.00
- Максимальна ціна: $1000.00

---

## 🔄 **ТИПИ ВАЛЮТ**

### **Основні валюти:**

- USD ($) - основна валюта
- EUR (€) - європейські клієнти
- GBP (£) - британські клієнти

### **Криптовалюти:**

- BTC (Bitcoin)
- ETH (Ethereum)
- USDT (Tether)

---

## 📋 **ПЛАТІЖНІ МЕТОДИ**

### **Традиційні:**

- PayPal
- Skrill
- Zelle

### **Криптовалюти:**

- BTC addresses
- Coinbase Commerce
- Direct crypto transfers

---

## ⚡ **ОПТИМІЗАЦІЇ РОЗРАХУНКІВ**

### **Кешування:**

- Price configurations (термін дії: 1 година)
- Game metadata (термін дії: 24 години)
- Booster availability (термін дії: 15 хвилин)

### **Пакетні операції:**

- Bulk price calculations
- Batch updates для цін
- Mass import з Excel

### **Асинхронні розрахунки:**

- Heavy calculations в background
- Real-time price updates
- Notification system для довгих операцій

---

## 💵 **КОНКРЕТНІ ЦІНИ ЗА ІГРАМИ**

### **World of Warcraft (WOW DF):**

- **01-05**: $1.00 за рівень
- **05-10**: $1.00 за рівень
- **10-15**: $1.50 за рівень
- **15-20**: $1.50 за рівень
- **20-25**: $2.00 за рівень

### **Call of Duty:**

- **Vanguard 01-05**: $2.00 за рівень
- **Vanguard 05-10**: $2.00 за рівень
- **Cold War 01-05**: $1.00 за рівень
- **Cold War 05-10**: $1.00 за рівень
- **Modern Warfare 01-05**: $5.00 за рівень
- **Modern Warfare 05-10**: $5.00 за рівень

### **Apex Legends:**

- **Bronze IV**: $8.00 за дивізіон
- **Bronze III**: $8.00 за дивізіон
- **Bronze II**: $8.00 за дивізіон
- **Bronze I**: $10.00 за дивізіон
- **Silver IV**: $10.00 за дивізіон

### **Escape from Tarkov:**

- **01-05**: $8.00 за рівень
- **05-10**: $10.00 за рівень
- **10-15**: $11.00 за рівень
- **15-20**: $12.00 за рівень
- **20-25**: $13.00 за рівень

### **Final Fantasy XIV:**

- **Primary 01-05**: $0.50 за рівень
- **Primary 05-10**: $0.50 за рівень
- **Secondary 01-05**: $0.25 за рівень (половина від primary)
- **Secondary 05-10**: $0.25 за рівень

### **Guild Wars 2:**

- **Character Leveling 01-05**: $0.50 за рівень
- **Character Leveling 05-10**: $0.50 за рівень
- **PVP 01-05**: $3.00 за рівень
- **PVP 05-10**: $3.00 за рівень
- **Map 01-05**: $1.00 за рівень
- **Map 05-10**: $1.00 за рівень

### **League of Legends:**

- Базові ціни від $0.00 (placement ігри)
- Division boost: ціни залежать від поточного рангу

### **Overwatch:**

- Ranked boosting з розрахунками SR (Skill Rating)
- Ціни залежать від поточного та цільового рангу

### **Valorant:**

- **Iron I**: $2.00 за рівень
- **Iron II**: $2.00 за рівень
- **Iron III**: $2.00 за рівень
- **Bronze I**: $2.00 за рівень

---

## 🔄 **ФОРМУЛИ РОЗРАХУНКІВ**

### **Лінійний розрахунок:**

```
Total Price = (To Level - From Level) × Price Per Level
```

### **Діапазонний розрахунок:**

```
Total Price = Σ (Levels in Range × Price for Range)
```

### **Рангові розрахунки:**

```
Division Price = Base Price × Division Multiplier
Placement Bonus = $15 (фіксована сума)
```

### **Часові розрахунки:**

```
Time-based Price = Hours Required × Hourly Rate × Complexity Multiplier
```

---

## 📊 **СТАТИСТИКА ЦІН**

### **Діапазон цін:**

- **Мінімальна ціна**: $0.20 (New World professions)
- **Максимальна ціна**: $1000+ (складні бусти)
- **Середня ціна**: $5-15 за рівень/дивізіон
- **Найпоширеніші ціни**: $1.00, $2.00, $5.00, $10.00

### **Розподіл за категоріями:**

- **Leveling**: $0.20 - $13.00
- **Rank Boosting**: $2.00 - $50.00+
- **Win Boosting**: $5.00 - $100.00+
- **Achievement Boosting**: $10.00 - $200.00+

---

## ⚙️ **КОНФІГУРАЦІЙНІ ПАРАМЕТРИ**

### **Базові коефіцієнти:**

- **Level Range Multiplier**: ×4 для 01-05, ×5 для інших діапазонів
- **Express Service**: ×1.5 (+50%)
- **Premium Account**: +$5.00
- **Placement Matches**: +$15.00

### **Обмеження системи:**

- **Макс. різниця рівнів**: 50
- **Мін. ціна**: $1.00
- **Макс. ціна**: $1000.00
- **Термін дії кешу**: 1 година для цін, 15 хв для доступності

---

**Цей документ містить всі необхідні дані для імплементації калькулятора Game Services. Він є єдиним джерелом істини для всіх розрахунків цін та модифікаторів.**
