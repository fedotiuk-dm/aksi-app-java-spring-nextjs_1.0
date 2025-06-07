import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Camera, Upload, Check, User, Package, Settings, FileText } from 'lucide-react';

const SinglePageOrderWizard = () => {
  // Основні стани
  const [step, setStep] = useState(1);

  // Дані клієнта
  const [client, setClient] = useState({
    search: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    contact_methods: [],
    source: ''
  });

  // Дані замовлення
  const [order, setOrder] = useState({
    receipt_number: 'RC-' + Date.now(),
    unique_label: '',
    branch: 'Центральна філія',
    date: new Date().toISOString().split('T')[0]
  });

  // Предмети
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    category: '',
    name: '',
    quantity: 1,
    material: '',
    color: '',
    stains: [],
    defects: [],
    modifiers: [],
    photos: [],
    price: 0
  });

  // Фінальні налаштування
  const [settings, setSettings] = useState({
    delivery_date: '',
    urgency: 'normal',
    discount_type: 'none',
    payment_method: 'terminal',
    prepayment: 0,
    notes: ''
  });

  // Refs для автоскролу
  const clientRef = useRef(null);
  const itemsRef = useRef(null);
  const settingsRef = useRef(null);
  const confirmRef = useRef(null);

  // Симуляція даних
  const categories = [
    { id: 'cleaning', name: 'Чистка одягу', items: [
      { name: 'Куртка', price: 120 },
      { name: 'Штани', price: 80 },
      { name: 'Сукня', price: 100 }
    ]},
    { id: 'leather', name: 'Шкіряні вироби', items: [
      { name: 'Куртка шкіряна', price: 200 },
      { name: 'Сумка', price: 150 }
    ]}
  ];

  const materials = ['Бавовна', 'Шерсть', 'Шовк', 'Синтетика', 'Шкіра'];
  const stainTypes = ['Жир', 'Кров', 'Вино', 'Кава', 'Трава', 'Чорнило'];
  const modifierTypes = [
    { id: 'child', name: 'Дитячі речі', percent: -30 },
    { id: 'hand', name: 'Ручна чистка', percent: 20 },
    { id: 'dirty', name: 'Дуже забруднені', percent: 50 },
    { id: 'urgent', name: 'Термінова чистка', percent: 100 }
  ];

  // Автоматичне розкриття наступного кроку
  useEffect(() => {
    if (step === 2 && client.name && client.phone) {
      setTimeout(() => itemsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else if (step === 3 && items.length > 0) {
      setTimeout(() => settingsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else if (step === 4) {
      setTimeout(() => confirmRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, [step, client, items]);

  // Розрахунок ціни предмета
  const calculateItemPrice = (item) => {
    let price = item.price || 0;
    item.modifiers.forEach(modId => {
      const modifier = modifierTypes.find(m => m.id === modId);
      if (modifier) {
        price += (price * modifier.percent / 100);
      }
    });
    return Math.round(price * 100) / 100;
  };

  // Загальна сума
  const totalPrice = items.reduce((sum, item) => sum + item.finalPrice, 0);

  // Обробники подій
  const handleClientChange = (field, value) => {
    setClient(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && value && client.phone) {
      setStep(2);
    }
  };

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'category') {
        const category = categories.find(c => c.id === value);
        updated.name = '';
        updated.price = 0;
      } else if (field === 'name') {
        const category = categories.find(c => c.id === updated.category);
        const item = category?.items.find(i => i.name === value);
        updated.price = item?.price || 0;
      }
      updated.finalPrice = calculateItemPrice(updated);
      return updated;
    });
  };

  const addItem = () => {
    if (currentItem.category && currentItem.name) {
      const newItem = {
        ...currentItem,
        id: Date.now(),
        finalPrice: calculateItemPrice(currentItem)
      };
      setItems(prev => [...prev, newItem]);
      setCurrentItem({
        category: '',
        name: '',
        quantity: 1,
        material: '',
        color: '',
        stains: [],
        defects: [],
        modifiers: [],
        photos: [],
        price: 0
      });

      // Автоматично переходимо до налаштувань після додавання першого предмета
      if (items.length === 0) {
        setStep(3);
      }
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const completeOrder = () => {
    setStep(4);
  };

  // Компонент секції
  const Section = ({ title, icon, isActive, isCompleted, children, stepNum }) => {
    const isExpanded = step >= stepNum;

    return (
      <div className={`border rounded-lg mb-4 transition-all duration-300 ${
        isActive ? 'border-blue-500 shadow-lg' :
        isCompleted ? 'border-green-500' : 'border-gray-200'
      }`}>
        <div
          className={`p-4 cursor-pointer flex items-center justify-between ${
            isActive ? 'bg-blue-50' : isCompleted ? 'bg-green-50' : 'bg-gray-50'
          }`}
          onClick={() => setStep(stepNum)}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isCompleted ? 'bg-green-100 text-green-600' :
              isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {isCompleted ? <Check size={20} /> : icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        {isExpanded && (
          <div className="p-4 border-t">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Order Wizard - Хімчистка</h1>

      {/* Прогрес-бар */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {/* Секція 1: Клієнт */}
      <div ref={clientRef}>
        <Section
          title="1. Клієнт та базова інформація"
          icon={<User size={20} />}
          isActive={step === 1}
          isCompleted={client.name && client.phone}
          stepNum={1}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-3">Інформація про клієнта</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Пошук існуючого клієнта..."
                  className="w-full p-2 border rounded"
                  value={client.search}
                  onChange={(e) => handleClientChange('search', e.target.value)}
                />
                <div className="text-sm text-gray-500">або створити нового:</div>
                <input
                  type="text"
                  placeholder="Прізвище та ім'я *"
                  className="w-full p-2 border rounded"
                  value={client.name}
                  onChange={(e) => handleClientChange('name', e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Телефон *"
                  className="w-full p-2 border rounded"
                  value={client.phone}
                  onChange={(e) => handleClientChange('phone', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  value={client.email}
                  onChange={(e) => handleClientChange('email', e.target.value)}
                />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Замовлення</h4>
              <div className="space-y-3">
                <div className="p-2 bg-gray-100 rounded">
                  Номер квитанції: <strong>{order.receipt_number}</strong>
                </div>
                <input
                  type="text"
                  placeholder="Унікальна мітка"
                  className="w-full p-2 border rounded"
                  value={order.unique_label}
                  onChange={(e) => setOrder(prev => ({ ...prev, unique_label: e.target.value }))}
                />
                <select className="w-full p-2 border rounded">
                  <option>{order.branch}</option>
                </select>
                <div className="p-2 bg-gray-100 rounded">
                  Дата: <strong>{order.date}</strong>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Секція 2: Предмети */}
      <div ref={itemsRef}>
        <Section
          title="2. Предмети замовлення"
          icon={<Package size={20} />}
          isActive={step === 2}
          isCompleted={items.length > 0}
          stepNum={2}
        >
          {/* Додавання предмета */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-3">Додати новий предмет</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                className="p-2 border rounded"
                value={currentItem.category}
                onChange={(e) => handleItemChange('category', e.target.value)}
              >
                <option value="">Виберіть категорію</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                className="p-2 border rounded"
                value={currentItem.name}
                onChange={(e) => handleItemChange('name', e.target.value)}
                disabled={!currentItem.category}
              >
                <option value="">Виберіть предмет</option>
                {currentItem.category && categories.find(c => c.id === currentItem.category)?.items.map(item => (
                  <option key={item.name} value={item.name}>{item.name} - {item.price}₴</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Кількість"
                className="p-2 border rounded"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Додаткові характеристики */}
            {currentItem.name && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    className="p-2 border rounded"
                    value={currentItem.material}
                    onChange={(e) => handleItemChange('material', e.target.value)}
                  >
                    <option value="">Матеріал</option>
                    {materials.map(mat => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Колір"
                    className="p-2 border rounded"
                    value={currentItem.color}
                    onChange={(e) => handleItemChange('color', e.target.value)}
                  />
                </div>

                {/* Плями */}
                <div>
                  <h5 className="font-medium mb-2">Плями:</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {stainTypes.map(stain => (
                      <label key={stain} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={currentItem.stains.includes(stain)}
                          onChange={(e) => {
                            const stains = e.target.checked
                              ? [...currentItem.stains, stain]
                              : currentItem.stains.filter(s => s !== stain);
                            handleItemChange('stains', stains);
                          }}
                        />
                        <span className="text-sm">{stain}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Модифікатори ціни */}
                <div>
                  <h5 className="font-medium mb-2">Додаткові послуги:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {modifierTypes.map(mod => (
                      <label key={mod.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={currentItem.modifiers.includes(mod.id)}
                          onChange={(e) => {
                            const modifiers = e.target.checked
                              ? [...currentItem.modifiers, mod.id]
                              : currentItem.modifiers.filter(m => m !== mod.id);
                            handleItemChange('modifiers', modifiers);
                          }}
                        />
                        <span className="text-sm">{mod.name} ({mod.percent > 0 ? '+' : ''}{mod.percent}%)</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Розрахунок ціни */}
                <div className="bg-blue-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span>Базова ціна:</span>
                    <span>{currentItem.price}₴</span>
                  </div>
                  {currentItem.modifiers.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      {currentItem.modifiers.map(modId => {
                        const mod = modifierTypes.find(m => m.id === modId);
                        return (
                          <div key={modId} className="flex justify-between">
                            <span>{mod.name}:</span>
                            <span>{mod.percent > 0 ? '+' : ''}{mod.percent}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>До сплати:</span>
                    <span>{calculateItemPrice(currentItem)}₴</span>
                  </div>
                </div>

                <button
                  onClick={addItem}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Додати предмет</span>
                </button>
              </div>
            )}
          </div>

          {/* Список доданих предметів */}
          {items.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Додані предмети ({items.length})</h4>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">({item.material}, {item.color})</span>
                      {item.stains.length > 0 && (
                        <span className="text-red-600 ml-2">Плями: {item.stains.join(', ')}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">{item.finalPrice}₴</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-right text-lg font-bold border-t pt-2">
                  Загальна сума: {totalPrice}₴
                </div>
              </div>
            </div>
          )}
        </Section>
      </div>

      {/* Секція 3: Налаштування */}
      <div ref={settingsRef}>
        <Section
          title="3. Параметри замовлення"
          icon={<Settings size={20} />}
          isActive={step === 3}
          isCompleted={settings.delivery_date}
          stepNum={3}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Дата готовності</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={settings.delivery_date}
                  onChange={(e) => handleSettingsChange('delivery_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Терміновість</label>
                <div className="space-y-2">
                  {[
                    { value: 'normal', label: 'Звичайне (без націнки)', price: 0 },
                    { value: 'urgent48', label: '+50% за 48 годин', price: 50 },
                    { value: 'urgent24', label: '+100% за 24 години', price: 100 }
                  ].map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="urgency"
                        value={option.value}
                        checked={settings.urgency === option.value}
                        onChange={(e) => handleSettingsChange('urgency', e.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Знижка</label>
                <select
                  className="w-full p-2 border rounded"
                  value={settings.discount_type}
                  onChange={(e) => handleSettingsChange('discount_type', e.target.value)}
                >
                  <option value="none">Без знижки</option>
                  <option value="evercard">Еверкард (10%)</option>
                  <option value="social">Соцмережі (5%)</option>
                  <option value="military">ЗСУ (10%)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Спосіб оплати</label>
                <select
                  className="w-full p-2 border rounded"
                  value={settings.payment_method}
                  onChange={(e) => handleSettingsChange('payment_method', e.target.value)}
                >
                  <option value="terminal">Термінал</option>
                  <option value="cash">Готівка</option>
                  <option value="account">На рахунок</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Передоплата</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={settings.prepayment}
                  onChange={(e) => handleSettingsChange('prepayment', parseFloat(e.target.value) || 0)}
                />
                <div className="text-sm text-gray-600 mt-1">
                  Залишок: {totalPrice - settings.prepayment}₴
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-2">Примітки</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={settings.notes}
              onChange={(e) => handleSettingsChange('notes', e.target.value)}
            />
          </div>

          <button
            onClick={completeOrder}
            disabled={!settings.delivery_date || items.length === 0}
            className="w-full mt-4 bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Переглянути замовлення
          </button>
        </Section>
      </div>

      {/* Секція 4: Підтвердження */}
      <div ref={confirmRef}>
        <Section
          title="4. Підтвердження та завершення"
          icon={<FileText size={20} />}
          isActive={step === 4}
          isCompleted={false}
          stepNum={4}
        >
          <div className="space-y-6">
            {/* Підсумок замовлення */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-3">Підсумок замовлення</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Клієнт:</strong> {client.name}<br />
                  <strong>Телефон:</strong> {client.phone}<br />
                  <strong>Дата готовності:</strong> {settings.delivery_date}
                </div>
                <div>
                  <strong>Предметів:</strong> {items.length}<br />
                  <strong>Сума:</strong> {totalPrice}₴<br />
                  <strong>Передоплата:</strong> {settings.prepayment}₴<br />
                  <strong>До доплати:</strong> {totalPrice - settings.prepayment}₴
                </div>
              </div>
            </div>

            {/* Детальний список предметів */}
            <div>
              <h4 className="font-semibold mb-3">Детальний список предметів</h4>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={item.id} className="border p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{index + 1}. {item.name}</span>
                        <div className="text-sm text-gray-600">
                          Матеріал: {item.material}, Колір: {item.color}
                          {item.stains.length > 0 && <div>Плями: {item.stains.join(', ')}</div>}
                          {item.modifiers.length > 0 && (
                            <div>Послуги: {item.modifiers.map(modId =>
                              modifierTypes.find(m => m.id === modId)?.name
                            ).join(', ')}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{item.finalPrice}₴</div>
                        <div className="text-sm text-gray-600">за {item.quantity} шт</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Підпис та завершення */}
            <div className="border-t pt-4">
              <label className="flex items-center space-x-2 mb-4">
                <input type="checkbox" />
                <span>Я погоджуюсь з умовами надання послуг</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                  Створити замовлення
                </button>
                <button className="bg-green-600 text-white p-3 rounded hover:bg-green-700">
                  Створити та надрукувати
                </button>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SinglePageOrderWizard;
