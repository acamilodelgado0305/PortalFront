import { UserOutlined } from "@ant-design/icons";

function UserProfileForm() {
  return (
    <div className="mt-[10vh] h-[700px] md:w-[500px] p-6 m-auto">
      <div className="icon-container">
        <UserOutlined className="text-[64px] text-violet-600 " />
      </div>
      <h2 className="text-[20px] text-violet-600">Registration Form</h2>
      <form>
        <label className="flex flex-col text-[18px] text-violet-800">
          Name
          <input
            type="text"
            className="mt-2 bg-[#dbc9fa91] rounded border-2 border-violet-600 p-2 transition duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="name"
            required
          />
        </label>

        <label className="flex flex-col text-[18px] text-violet-800">
          Password
          <input
            type="password"
            className="mt-2 bg-[#dbc9fa91] rounded border-2 border-violet-600 p-2 transition duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="password"
            required
          />
        </label>

        <label className="flex flex-col text-[18px] text-violet-800">
          Confirm Password
          <input
            type="password"
            className="mt-2 bg-[#dbc9fa91] rounded border-2 border-violet-600 p-2 transition duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="confirm password"
            required
          />
        </label>

        <label className="flex flex-col text-[18px] text-violet-800">
          WhatsApp Number
          <input
            type="text"
            className="mt-2 bg-[#dbc9fa91] rounded border-2 border-violet-600 p-2 transition duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="whatsapp number"
            required
          />
        </label>

        <label className="flex flex-col text-[18px] text-violet-800">
          Email
          <input
            type="email"
            className="mt-2 bg-[#dbc9fa91] rounded border-2 border-violet-600 p-2 transition duration-200 ease-in-out focus:border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="email"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-violet-600 text-white rounded p-2 transition duration-200 hover:bg-violet-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default UserProfileForm;
