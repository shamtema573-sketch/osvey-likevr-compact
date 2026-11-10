window.OSVEY = {
  base: 280000, exterior: 280000, days: 45,
  interiors: [
    {id:'cad', label:'Одна компоновка с CAD', detail:'Подходящая модель заказчика', price:310000},
    {id:'sketch', label:'Одна компоновка по эскизам', detail:'Воссоздание без подходящей CAD-модели', price:350000},
    {id:'three', label:'Три компоновки', detail:'Требования к исходникам уточним', price:690000},
  ],
  equipment: [
    {id:'standalone', label:'Автономная гарнитура', detail:'Потребуется компромисс по качеству графики', price:95000},
    {id:'pc', label:'Гарнитура и ПК', detail:'Для более выразительной графики', price:290000},
  ],
  presets: {
    min: { exterior:true, interior:'cad', equipment:'standalone', label:'Минимальный рекомендуемый' },
    max: { exterior:true, interior:'three', equipment:'pc', label:'Максимальный рекомендуемый' },
  },
  telegram: 'https://t.me/ART_TEAM573',
  email: 's.artem@likevr.ru',
  phone: '+74950667169',
  phoneLabel: '+7 (495) 066-71-69',
};
