import { useContext, useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Checkout = () => {
  const { cart, totalPrice } = useContext(CartContext);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  // Search dropdown states
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extensive list of Pakistani cities and major towns
  const pakistaniCities = [
    "Abbottabad", "Abdul Hakeem", "Ahmedpur East", "Alipur", "Arifwala", "Attock", "Baddomalhi", "Badin",
    "Bagh", "Bahawalnagar", "Bahawalpur", "Bannu", "Barikot", "Batgram", "Bela", "Bhakkar", "Bhalwal",
    "Bhimber", "Burewala", "Chakwal", "Chaman", "Charsadda", "Chichawatni", "Chiniot", "Chishtian",
    "Chitral", "Choa Saidan Shah", "Chunian", "Dadu", "Dadyal", "Daharki", "Darya Khan", "Daska",
    "Dera Ghazi Khan", "Dera Ismail Khan", "Dina", "Dinga", "Dipalpur", "Dokri", "Dunya Pur", "Farooka",
    "Faisalabad", "Fateh Jang", "Gakhar Mandi", "Gharo", "Ghazni Khel", "Ghotki", "Goandlanwala", "Gojra",
    "Gujar Khan", "Gujranwala", "Gujrat", "Gwadar", "Hafizabad", "Hala", "Hangu", "Haripur", "Haroonabad",
    "Hasan Abdal", "Havelian", "Hazro", "Hujra Shah Muqeem", "Hyderabad", "Iskandarabad", "Islamabad",
    "Jacobabad", "Jahanian", "Jalalpur Jattan", "Jalalpur Pirwala", "Jampur", "Jamshoro", "Jand", "Jaranwala",
    "Jauharabad", "Jehangira", "Jhang", "Jhelum", "Jhudo", "Kabirwala", "Kahat", "Kahror Pakka", "Kahuta",
    "Kala Bagh", "Kalam", "Kallor Kot", "Kamalia", "Kamar Mushani", "Kamber Ali Khan", "Kamoke", "Kandhkot",
    "Kandiaro", "Karachi", "Karak", "Karoor Lal Easan", "Kashmore", "Kasur", "Keti Bandar", "Khairpur",
    "Khanary", "Khanewal", "Khanpur", "Khanqah Sharif", "Kharian", "Khushab", "Khuzdar", "Kohat", "Kot Addu",
    "Kot Ghulam Muhammad", "Kot Radha Kishan", "Kotli", "Kotli Sattian", "Kotri", "Kulachi", "Kundian",
    "Kunjah", "Lahore", "Laki Marwat", "Lalamusa", "Lalian", "Larkana", "Leiah", "Liaquatpur", "Lodhran", "Loralai",
    "Madyan", "Mailsi", "Makhdoom Pur Pahuran", "Malakwal", "Mamu Kanjan", "Mansehra", "Mardan", "Matiari",
    "Matli", "Mehar", "Mian Channu", "Mianwali", "Minchinabad", "Mingora", "Mirpur Azad Kashmir",
    "Mirpur Khas", "Mirpur Mathelo", "Mithani", "Mithi", "Moro", "Multan", "Muridke", "Murree",
    "Mustafabad", "Muzaffarabad", "Muzaffargarh", "Nankana Sahib", "Narang Mandi", "Narowal", "Nasirabad",
    "Naudero", "Naushahro Feroze", "Naushahra", "Nawabshah", "Nazimabad", "Nowshera", "Nushki", "Okara",
    "Ormara", "Pabbi", "Pakpattan", "Panjgur", "Pano Aqil", "Pasni", "Pasrur", "Pattoki", "Peshawar",
    "Phae", "Phool Nagar", "Pind Dadan Khan", "Pindi Bhattian", "Pindi Gheb", "Pir Jo Goth", "Pir Mahal",
    "Pishin", "Qila Didar Singh", "Quetta", "Rabwah", "Rahim Yar Khan", "Raiwind", "Rajanpur", "Ranipur",
    "Rato Dero", "Rawalakot", "Rawalpindi", "Renala Khurd", "Risalpur", "Rohri", "Sadiqabad", "Safdarabad",
    "Sahiwal", "Saidu Sharif", "Sakrand", "Sambrial", "Samundri", "Sanawan", "Sanghar", "Sangla Hill",
    "Sanjwal", "Sargodha", "Sehwan Sharif", "Shabqadar", "Shahdadkot", "Shahdadpur", "Shahkot", "Shahpur",
    "Shakargarh", "Sharaqpur", "Sheikhupura", "Shikarpur", "Shorkot", "Shujaabad", "Sialkot", "Sibi",
    "Sillanwali", "Sita Road", "Sukkur", "Swabi", "Swat", "Taftan", "Tala Gang", "Talamba", "Tando Adam",
    "Tando Allahyar", "Tando Muhammad Khan", "Tangi", "Tank", "Taunsa Sharif", "Taxila", "Thalo",
    "Thanil Kamal", "Thari Mirwah", "Tharparkar", "Thatta", "Thul", "Toba Tek Singh", "Topi", "Turbat",
    "Ubauro", "Uch Sharif", "Umarkot", "Upper Dir", "Usta Muhammad", "Vihari", "Vehari", "Wadh", "Wah Cantonment",
    "Warah", "Wazirabad", "Yazman", "Zafarwal", "Zahir Pir", "Ziarat"
  ].sort();

  const filteredCities = pakistaniCities.filter((cityName) =>
    cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrder = (e) => {
    e.preventDefault();
    if (!city) {
      alert("Please select a city from the list.");
      return;
    }
    alert(`Order Placed!\nTotal: $${totalPrice}\nAddress: ${address}, ${city}\nPhone: ${phone}`);
  };

  const shipping = cart.length > 0 ? 15 : 0;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-[#0b1329]">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 py-12">
        {/* FIXED: Heading color is now bright white to look clear over the deep navy background */}
        <h1 className="text-3xl font-black text-white tracking-tight mb-8 text-left">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* LEFT - FORM CONTAINER CARD */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
              Shipping Information
            </h2>

            <form onSubmit={handleOrder} className="space-y-5">

              {/* FIXED: Embedded styles to clean up field values rendering over light background sheets */}
              <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
                <Input
                  type="text"
                  label="Full Address"
                  placeholder="123 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 items-end">

                {/* SEARCHABLE CITY SELECTION CONTAINER */}
                <div className="flex flex-col items-start w-full relative text-left" ref={dropdownRef}>
                  <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    tabIndex={-1}
                    className="absolute opacity-0 pointer-events-none bottom-0 left-0 w-full h-1"
                    required
                    onChange={() => { }}
                  />

                  {/* FIXED: Darkened border and structured bg for pristine readability inside the white card */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full border-2 border-slate-300 focus-within:border-purple-600 rounded-xl px-4 py-3 text-sm bg-slate-50 text-slate-900 flex justify-between items-center cursor-pointer h-[46px] shadow-sm hover:bg-slate-100/70 transition-all"
                  >
                    <span className={city ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}>
                      {city || "Search or choose city"}
                    </span>
                    <svg className={`w-4 h-4 text-slate-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* SEARCH RESULTS DROPDOWN FLUID POP-OVER */}
                  {isDropdownOpen && (
                    <div className="absolute top-[76px] left-0 w-full bg-white border border-slate-300 rounded-xl shadow-2xl z-50 overflow-hidden border-t-2">
                      <div className="p-2 border-b border-slate-200 bg-slate-100">
                        {/* FIXED: Explicitly dark layout for search input box */}
                        <input
                          type="text"
                          placeholder="Type city name to search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-white border-2 border-purple-300 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-600 font-bold"
                          autoFocus
                        />
                      </div>

                      <ul className="max-h-48 overflow-y-auto text-left text-xs font-bold text-slate-800 divide-y divide-slate-100">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((cityName) => (
                            <li
                              key={cityName}
                              onClick={() => {
                                setCity(cityName);
                                setSearchQuery("");
                                setIsDropdownOpen(false);
                              }}
                              className={`px-4 py-2.5 hover:bg-purple-600 hover:text-white cursor-pointer transition-colors ${city === cityName ? "bg-purple-100 text-purple-900" : ""
                                }`}
                            >
                              {cityName}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-slate-400 text-center font-medium bg-white">
                            No matching cities found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* PHONE NUMBER VALUE TEXT BOX */}
                <div className="flex flex-col text-left w-full [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
                  <Input
                    type="text"
                    label="Phone Number"
                    placeholder="+92 (300) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-sm tracking-wider uppercase font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md rounded-xl transition-colors"
                >
                  Place Order
                </Button>
              </div>
            </form>
          </div>

          {/* RIGHT - SUMMARY SIDE CONTAINER PANEL */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium text-left">No items in your cart.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm font-semibold text-slate-600"
                    >
                      <div className="text-left">
                        <p className="text-slate-800 font-bold">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                      </div>
                      <p className="text-slate-800">${item.price * item.qty}</p>
                    </div>
                  ))}
                </div>

                <hr className="border-slate-200 my-4" />

                <div className="space-y-3 text-sm text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-slate-800">${shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (included)</span>
                    <span className="text-slate-800">$0.00</span>
                  </div>
                  <hr className="border-slate-200 my-2" />
                  <div className="flex justify-between text-base font-bold text-slate-800">
                    <span>Grand Total</span>
                    <span className="text-purple-600 font-black">${grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;