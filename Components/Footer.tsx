import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-center py-10 border-t-4 border-orange-400">
      <h1 className="text-4xl font-bold mb-10">Amo</h1>

      <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-10 mb-10 px-6">
        {/* Location */}
        <div className="flex items-start gap-4">
          <div className="p-3">
            <Image src="/images/Group 33 (1).png" alt="Location" width={32} height={32} />
          </div>
          <div className="text-left">
            <h2 className="font-semibold">Amo Co., Ltd. - Bangkok, Thailand</h2>
            <p className="text-sm">37 Srinakarin 45 Pravet Bangkok 10250</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="p-3">
            <Image src="/images/Group 143.png" alt="Phone" width={32} height={32} />
          </div>
          <div className="text-left text-sm">
            <p>02-056-0610</p>
            <p>091-718-1150</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="p-3">
            <Image src="/images/Group 144.png" alt="Email" width={32} height={32} />
          </div>
          <div className="text-left text-sm">
            <p>info@amo.co.th</p>
          </div>
        </div>
      </div>

      <p className="text-orange-500 italic text-xl mb-6">
        Follow <span className="font-semibold">Us</span> for More
      </p>

      <div className="flex justify-center gap-6 text-orange-500 text-2xl mb-6">
        <Image src="/images/contactus_btn-1.png" alt="LINE" width={28} height={28} />
        <Image src="/images/contactus_btn-2.png" alt="Facebook" width={28} height={28} />
        <Image src="/images/contactus_btn.png" alt="Instagram" width={28} height={28} />
      </div>

      <hr className="border-t border-orange-300 w-11/12 mx-auto mb-6" />

      <p className="text-sm text-gray-500">© 2016 Amo Co., Ltd. All rights reserved.</p>
    </footer>
  );
};

export default Footer;