# BarcodeSlice
- *Slice* dosyalarında Console.log() yazma hata alırsın.
- *Barcode* tablosundaki Updatetime personelin çıkış tarihidir

# Custom Toast
- Custom Toast mesajında iki tarafın tiplerine dikkat et ve parametreler props içersinde gönderilir.

# Mağaza silme Durumu
- Aktif bir mağazayı silmek isityorsan önce gidip pasif hale getirmen gerekir.

# LocationStore
- LocationStore backend de herhangi bir yere istek atmıyor.
- Backend de harita içerisindeki mesafe hesaplanınca radius değeri metre cinsiden yarıçap

# Device
 # Cihaz Ekleme
 - *Cihaz Ekleme* işleminde sisteme giriş yaptığında cihazda bir token yoksa bir token üretip hem cihazın belleğine ekler hemde veritabanına bu token üretme işleminde *UserId,UserName,Password,DeviceBrand,DeviceModelName,CreateTime* verilerinden tek yönlü bir şifreleme yapılır çözülemez.
 - *Cihaz Ekleme* işleminde token üretilirken CreateTime verilmesinin sebebi kullanıcı aynı marka ve modelden başka bir telefondan giriş yaparsa tokenleri farklı olması için eklendi.
 # Cihaz Sil
  - *Cihaz silme* işleminde silinen cihazın tokeni frontend den ve veritabanından silinir.
 # Cihaz Onayla 
  - *Cihaz onaylama* işleminde bir kullanıcı önceden bir cihaz ile sisteme giriş yapmışsa,ardından farklı bir cihaz ile hesabına tekrar giriş yaparsa cihaz onayı gönderilir.
  - *Cihaz onaylama* işleminde giriş yapanın cihaz veritabanında yoksa ama uygulamaya da başka birinin telefonundan giriş yaparsa sadece *kendi cihazından giriş yap* uyarısı alır.
  - Admin Onay verirse artık kullanıcının yeni cihazı en son giriş yaptığı cihaz olur onay vermezse eski cihazdan devam eder.