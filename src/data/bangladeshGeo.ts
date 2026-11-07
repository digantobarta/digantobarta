export interface DivisionData {
  id: string;
  name: string;
  nameEn: string;
  districts: {
    id: string;
    name: string;
    nameEn: string;
  }[];
}

export const BANGLADESH_DIVISIONS: DivisionData[] = [
  {
    id: 'dhaka',
    name: 'ঢাকা',
    nameEn: 'Dhaka',
    districts: [
      { id: 'dhaka', name: 'ঢাকা', nameEn: 'Dhaka' },
      { id: 'gazipur', name: 'গাজীপুর', nameEn: 'Gazipur' },
      { id: 'narayanganj', name: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj' },
      { id: 'tangail', name: 'টাঙ্গাইল', nameEn: 'Tangail' },
      { id: 'faridpur', name: 'ফরিদপুর', nameEn: 'Faridpur' },
      { id: 'manikganj', name: 'মানিকগঞ্জ', nameEn: 'Manikganj' },
      { id: 'munshiganj', name: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj' },
      { id: 'narsingdi', name: 'নরসিংদী', nameEn: 'Narsingdi' },
      { id: 'gopalganj', name: 'গোপালগঞ্জ', nameEn: 'Gopalganj' },
      { id: 'madaripur', name: 'মাদারীপুর', nameEn: 'Madaripur' },
      { id: 'rajbari', name: 'রাজবাড়ী', nameEn: 'Rajbari' },
      { id: 'shariatpur', name: 'শরীয়তপুর', nameEn: 'Shariatpur' },
      { id: 'kishoreganj', name: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj' },
    ],
  },
  {
    id: 'chattogram',
    name: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    districts: [
      { id: 'chattogram', name: 'চট্টগ্রাম', nameEn: 'Chattogram' },
      { id: 'coxsbazar', name: 'কক্সবাজার', nameEn: "Cox's Bazar" },
      { id: 'cumilla', name: 'কুমিল্লা', nameEn: 'Cumilla' },
      { id: 'feni', name: 'ফেনী', nameEn: 'Feni' },
      { id: 'brahmanbaria', name: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria' },
      { id: 'chandpur', name: 'চাঁদপুর', nameEn: 'Chandpur' },
      { id: 'noakhali', name: 'নোয়াখালী', nameEn: 'Noakhali' },
      { id: 'lakshmipur', name: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur' },
      { id: 'khagrachhari', name: 'খাগড়াছড়ি', nameEn: 'Khagrachhari' },
      { id: 'rangamati', name: 'রাঙ্গামাটি', nameEn: 'Rangamati' },
      { id: 'bandarban', name: 'বান্দরবান', nameEn: 'Bandarban' },
    ],
  },
  {
    id: 'rajshahi',
    name: 'রাজশাহী',
    nameEn: 'Rajshahi',
    districts: [
      { id: 'rajshahi', name: 'রাজশাহী', nameEn: 'Rajshahi' },
      { id: 'bogura', name: 'বগুড়া', nameEn: 'Bogura' },
      { id: 'pabna', name: 'পাবনা', nameEn: 'Pabna' },
      { id: 'sirajganj', name: 'সিরাজগঞ্জ', nameEn: 'Sirajganj' },
      { id: 'naogaon', name: 'নওগাঁ', nameEn: 'Naogaon' },
      { id: 'natore', name: 'নাটোর', nameEn: 'Natore' },
      { id: 'chapainawabganj', name: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj' },
      { id: 'joypurhat', name: 'জয়পুরহাট', nameEn: 'Joypurhat' },
    ],
  },
  {
    id: 'khulna',
    name: 'খুলনা',
    nameEn: 'Khulna',
    districts: [
      { id: 'khulna', name: 'খুলনা', nameEn: 'Khulna' },
      { id: 'jashore', name: 'যশোর', nameEn: 'Jashore' },
      { id: 'satkhira', name: 'সাতক্ষীরা', nameEn: 'Satkhira' },
      { id: 'bagerhat', name: 'বাগেরহাট', nameEn: 'Bagerhat' },
      { id: 'kushtia', name: 'কুষ্টিয়া', nameEn: 'Kushtia' },
      { id: 'chuadanga', name: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga' },
      { id: 'meherpur', name: 'মেহেরপুর', nameEn: 'Meherpur' },
      { id: 'jhenaidah', name: 'ঝিনাইদহ', nameEn: 'Jhenaidah' },
      { id: 'magura', name: 'মাগুরা', nameEn: 'Magura' },
      { id: 'narail', name: 'নড়াইল', nameEn: 'Narail' },
    ],
  },
  {
    id: 'barishal',
    name: 'বরিশাল',
    nameEn: 'Barishal',
    districts: [
      { id: 'barishal', name: 'বরিশাল', nameEn: 'Barishal' },
      { id: 'bhola', name: 'ভোলা', nameEn: 'Bhola' },
      { id: 'patuakhali', name: 'পটুয়াখালী', nameEn: 'Patuakhali' },
      { id: 'pirojpur', name: 'পিরোজপুর', nameEn: 'Pirojpur' },
      { id: 'barguna', name: 'বরগুনা', nameEn: 'Barguna' },
      { id: 'jhalokati', name: 'ঝালকাঠি', nameEn: 'Jhalokati' },
    ],
  },
  {
    id: 'sylhet',
    name: 'সিলেট',
    nameEn: 'Sylhet',
    districts: [
      { id: 'sylhet', name: 'সিলেট', nameEn: 'Sylhet' },
      { id: 'moulvibazar', name: 'মৌলভীবাজার', nameEn: 'Moulvibazar' },
      { id: 'habiganj', name: 'হবিগঞ্জ', nameEn: 'Habiganj' },
      { id: 'sunamganj', name: 'সুনামগঞ্জ', nameEn: 'Sunamganj' },
    ],
  },
  {
    id: 'rangpur',
    name: 'রংপুর',
    nameEn: 'Rangpur',
    districts: [
      { id: 'rangpur', name: 'রংপুর', nameEn: 'Rangpur' },
      { id: 'dinajpur', name: 'দিনাজপুর', nameEn: 'Dinajpur' },
      { id: 'gaibandha', name: 'গাইবান্ধা', nameEn: 'Gaibandha' },
      { id: 'kurigram', name: 'কুড়িগ্রাম', nameEn: 'Kurigram' },
      { id: 'lalmonirhat', name: 'লালমনিরহাট', nameEn: 'Lalmonirhat' },
      { id: 'nilphamari', name: 'নীলফামারী', nameEn: 'Nilphamari' },
      { id: 'panchagarh', name: 'পঞ্চগড়', nameEn: 'Panchagarh' },
      { id: 'thakurgaon', name: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon' },
    ],
  },
  {
    id: 'mymensingh',
    name: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    districts: [
      { id: 'mymensingh', name: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
      { id: 'jamalpur', name: 'জামালপুর', nameEn: 'Jamalpur' },
      { id: 'netrokona', name: 'নেত্রকোণা', nameEn: 'Netrokona' },
      { id: 'sherpur', name: 'শেরপুর', nameEn: 'Sherpur' },
    ],
  },
];
