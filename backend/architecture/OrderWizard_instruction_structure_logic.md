# Single-Page Dry Cleaning Order System

## Overview and Architecture

The single-page dry cleaning order system is a compact interface for rapid order processing with integrated price calculation system, customer management, and receipt generation. All functionality is placed on a single page for maximum operator efficiency.

## Single-Page System Structure (3 Main Sections)

### Section 1: Customer and Basic Order Information (Left Block - 30%)

#### 1.1. Quick Customer Search and Management

- **Existing Customer Search**
  - Auto-completion by surname, name, phone, email
  - Quick customer selection from results list
  - Ability to edit selected customer

#### 1.2. New Customer Mini-Form (Collapsible/Expandable)

- **Required Fields**:
  - Last name and first name
  - Phone number
- **Optional Fields**:
  - Email
  - Address
- **Communication Methods** (multi-select checkboxes):
  - Phone number
  - SMS
  - Viber
- **Dry Cleaning Information Source** (dropdown):
  - Instagram
  - Google
  - Recommendations
  - Other (with specification field)

#### 1.3. Basic Order Information

- **Receipt Number** (generated automatically)
- **Unique Label** (input field + QR code scanner)
- **Order Reception Point** (branch selection dropdown)
- **Order Creation Date** (displayed automatically)

### Section 2: Items and Calculations (Central Block - 50%)

#### 2.1. Compact Items Table

- **Table Headers**: Name | Category | Qty | Material | Color | Amount | Actions
- **Functionality**:
  - "+" button for adding new rows
  - Inline editing of existing rows
  - "Edit" and "Delete" buttons for each row

#### 2.2. Quick Item Addition Form (Expands Below Table)

##### Basic Item Information

- **Service Category** (dropdown, auto-updates items list):

  - Clothing and textile cleaning
  - Laundry service
  - Ironing
  - Leather goods cleaning and restoration
  - Sheepskin coats
  - Natural fur products
  - Textile dyeing

- **Product Name** (dynamic list based on category)
- **Unit of Measure and Quantity**:
  - Pieces (for most products)
  - Kilograms (for linen and certain textile products)
  - Field for numerical value input

##### Item Characteristics

- **Material** (dropdown, depends on category):

  - Cotton, Wool, Silk, Synthetic
  - Smooth leather, Nubuck, Split leather, Suede

- **Color**:

  - List of basic colors for quick selection
  - Field for custom color input

- **Filler** (for relevant categories):

  - Down, Synthetic padding, Other (manual)
  - "Compressed filler" checkbox

- **Wear Degree** (dropdown): 10%, 30%, 50%, 75%

##### Contamination, Defects and Risks

- **Stains** (multiselect checkboxes):

  - Grease, Blood, Protein, Wine, Coffee, Grass, Ink, Cosmetics
  - Other (with specification field)

- **Defects and Risks** (multiselect checkboxes):

  - Wear marks, Torn, Missing hardware, Hardware damage
  - Color change risks, Deformation risks
  - No warranty (with mandatory reason explanation)

- **Defect Notes** (text field)

##### Express Modifiers (Checkboxes for Quick Application)

**General Coefficients** (available for all categories):

- Children's items (up to size 30) - 30% of cost
- Hand cleaning +20% to cost
- Very soiled items +20% to 100% to cost
- Express cleaning +50% to 100% to cost

**Textile Product Modifiers** (displayed for corresponding categories):

- Cleaning items with fur collars and cuffs +30%
- Water-repellent coating application +30%
- Cleaning natural silk, satin, chiffon items +50%
- Cleaning combined items (leather+textile) +100%
- Hand cleaning of large soft toys +100%
- Button sewing (fixed cost per unit)
- Cleaning black and light-colored items +20%
- Wedding dress with train cleaning +30%

**Leather Product Modifiers** (displayed for leather categories):

- Leather item ironing 70% of cleaning cost
- Water-repellent coating application +30%
- Dyeing (after our cleaning) +50%
- Dyeing (after cleaning elsewhere) 100% cleaning cost
- Cleaning leather items with inserts +30%
- Pearl coating application +30%
- Natural sheepskin on artificial fur cleaning -20%
- Hand cleaning of leather items +30%

##### Photo Documentation

- **Photo Upload**:
  - "Camera" button (using WebRTC API)
  - "Gallery" button (input type="file" with accept="image/*")
  - Thumbnail preview with delete option
  - Limitations: maximum 5 photos per item, up to 5MB each
  - Automatic compression before upload

#### 2.3. Interactive Calculator (Below Form)

- **Real-time Calculation Display**:
  - Base price (automatically from price list)
  - Each modifier impact (in percentages and money)
  - Intermediate sums at each stage
  - Final price per item
- **Calculation Details** (collapsible/expandable)

### Section 3: Summary and Completion (Right Block - 20%)

#### 3.1. General Order Parameters

- **Completion Date**:

  - Calendar with date selection
  - Automatic calculation based on added item categories
  - Standard timeline information (48 hours for regular/14 days for leather)

- **Express Completion** (dropdown):
  - Regular (no surcharge)
  - +50% for 48 hours
  - +100% for 24 hours
  - Automatic completion date recalculation on change

#### 3.2. Discounts (Global for Order)

- **Discount Type** (dropdown):

  - No discount
  - Evercard (10%)
  - Social media (5%)
  - Armed Forces of Ukraine (10%)
  - Other (with percentage input field)

- **Important Limitation** (system checks automatically):
  - Discounts do not apply to ironing, washing, and textile dyeing
  - Warning display if discount is not applicable
  - Automatic exclusion of ineligible categories

#### 3.3. Financial Block

- **Calculations**:

  - Amount before discount (automatic)
  - Discount (amount if applicable)
  - **Total Cost** (highlighted)
  - Paid (field for prepayment entry)
  - Debt (calculated automatically as difference)

- **Payment Method** (dropdown):
  - Terminal
  - Cash
  - Bank transfer

#### 3.4. Order Completion

- **Order Notes** (text field)
- **Legal Aspects**:
  - Checkbox "I agree to the terms of service provision" (required)
  - Links to government documents
- **Customer Digital Signature**:
  - Canvas area for signature on touch screen
  - "Clear" and "Save Signature" buttons
- **"PRINT RECEIPT" Button** (large, highlighted button)

## Receipt Structure (Full Details)

### Receipt Header

- Dry cleaning logo
- Company name and legal information
- Address and contact details
- Reception point (branch)
- Operator's surname and initials

### Order Information

- Receipt number
- Unique label number
- Order creation date
- Estimated delivery date (clearly state "after 2:00 PM")

### Customer Information

- Full name
- Contact phone
- Selected communication method
- Address (if provided)

### Items Table with Full Details

- **Headers**: № | Name | Category | Qty/Weight | Material | Color | Filler | Base Price | Modifiers | Final Price

- **Detailed Calculation for Each Item**:
  - Base price
  - Each applied modifier with its price impact
  - Intermediate calculations
  - Final price per item

### Contamination and Defects Section

- List of identified stains (by type)
- List of defects and risks
- "No warranty" note (if applicable) with explanation

### Financial Information

- Service cost before discounts
- Discount (if applicable, with specified type and amount)
- Urgency surcharge (if applicable)
- **Total Cost**
- Paid (prepayment)
- Remaining balance due upon pickup
- Payment method

### Legal Information

- Standard terms of service provision
- Liability limitations
- Information about possible risks
- Reference to complete contract terms

### Signatures and Stamps

- Space for customer digital signature (upon drop-off)
- Space for customer signature upon pickup
- Operator signature
- Company stamp (if applicable)

### Footer

- Contact information for communication
- Working hours
- QR code for order status tracking

## Cost Calculation Logic

### 1. Rules for Applying Discounts and Surcharges

- Order-wide discounts do not apply to washing, ironing, and textile dyeing services
- Additional service surcharges are calculated first, then discounts are applied
- When multiple surcharges apply, they are added to base price sequentially (not multiplied)

### 2. Cost Calculation Process for Each Item

1. **Base Price** (from price list based on category and name)
2. **Color Product Check** - different price for black and other colors
3. **Special Modifier Application** - some may replace base price
4. **Multiplier Application** - coefficients for material, condition, additional services
5. **Fixed Service Addition** - for example, button sewing
6. **Urgency** (if selected): +50% or +100% to intermediate sum
7. **Discounts** (if applicable and allowed for this category)
8. **Rounding** to kopecks (2 decimal places)

### 3. Smart Dependencies and Automation

- When selecting category, automatically updates:

  - List of available names
  - List of possible materials
  - Set of available additional services
  - Unit of measure (pcs/kg)
  - Expected completion time

- When selecting urgency:

  - Automatic recalculation of all item costs
  - Completion date update

- When selecting certain contamination types:
  - System automatically suggests relevant additional services
  - Risk warnings may appear

## Real-time Calculation Transparency

### 1. Interactive Calculator

- Calculation display during form filling
- Base price + each modifier impact
- Intermediate sums at each stage
- Final price per item with details

### 2. Order Total Summary

- Sum of all items
- Total discounts and surcharges
- Final amount to pay
- Real-time updates on changes

### 3. Full Receipt Details

- Detailed calculation for each item
- Clear display of all applied modifiers
- Transparent final amount calculation

## Database Integration

### 1. Price List Structure

- **Service Categories** (ServiceCategory): ID, code, name, description
- **Price List** (PriceListItem): ID, category, number, name, unit of measure, base price
- **Additional Fields**: different prices for black/other colors

### 2. Modifier and Coefficient Storage

- Backend modifier configuration
- Flexible coefficient application system

### 3. Order Storage

- Full calculation details for each item
- Ability to reproduce calculations at any time
- Change history and audit

## Technical Recommendations

### 1. Responsive Interface

- Responsive design for tablets and desktops
- Touch interface optimization
- Special components for quick input

### 2. Performance Optimization

- Price list caching
- Lazy loading for large lists
- Real-time calculation optimization

### 3. UX/UI Optimizations

- Auto-save of entered data
- Real-time validation
- Quick keyboard shortcuts
- Intuitive field navigation

## Conclusion

The single-page order system provides:

- **Work Speed** - all functions on one screen
- **Calculation Transparency** - in real time
- **Information Completeness** - detailed documentation
- **Ease of Use** - optimized for operators
- **Configuration Flexibility** - wide customization possibilities for prices and services
