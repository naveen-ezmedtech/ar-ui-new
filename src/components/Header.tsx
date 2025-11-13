import logo from '../assets/favicon-32x32.png';

export const Header = () => {
  return (
    <header className="mb-8">
      <div className="bg-white px-6 py-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="EZ MEDTECH" className="h-12 w-12 object-contain" />
          <h1 className="text-2xl font-bold text-teal-700">Account Receivability Dashboard</h1>
        </div>
      </div>
      
      <div className="mt-4 px-6 py-5 bg-white rounded-2xl shadow-sm">
        <p className="text-gray-700 font-medium">Upload and manage patient invoices for automated calling</p>
      </div>
    </header>
  );
};
