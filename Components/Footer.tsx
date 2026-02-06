import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-center py-10">
      <h1 className=" text-black font-serif font-bold text-3xl tracking-wider;">Amo</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-10 px-6">

        {/* Location */}
        <div className="flex items-center gap-4">
          <a
            href="https://maps.app.goo.gl/srxvQ1u49QgxVymt7"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 cursor-pointer"
          >
            <Image
              src="/static/pin-bottom.png"
              alt="Location"
              width={32}
              height={32}
            />
          </a>

          <div className="text-left">
            <h2 className="font-semibold text-black">
              Amo Co., Ltd. - Bangkok, Thailand
            </h2>
            <p className="text-sm text-black">
              37 Srinakarin 45 Pravet Bangkok 10250
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="p-3">
            <Image
              src="/static/call-bottom.png"
              alt="Phone"
              width={32}
              height={32}
            />
          </div>
          <div className="text-left text-sm text-black">
            <p>02-056-0610</p>
            <p>091-718-1150</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <div className="p-3">
            <Image
              src="/static/email-bottom.png"
              alt="Email"
              width={32}
              height={32}
            />
          </div>
          <div className="text-left text-sm text-black">
            <p>info@amo.co.th</p>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-2xl mb-6">
        <Image
          src="/static/followusformore-bottom.png"
          alt="Follow us"
          width={260}
          height={28}
        />
        <a
          href="https://line.me/ti/p/~amocorner"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
        <Image
          src="/static/line-bottom.png"
          alt="LINE"
          width={28}
          height={28}
          className="w-auto h-[28px] object-contain"
        />
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/AmoCoLtd"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Image
            src="/static/facebook-bottom.png"
            alt="Facebook"
            width={28}
            height={28}
            className="w-auto h-[28px] object-contain"
          />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/amo.co.ltd?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Image
            src="/static/instagram-bottom.png"
            alt="Instagram"
            width={28}
            height={28}
            className="w-auto h-[28px] object-contain"
          />
        </a>
      </div>

      <hr className="border-t border-orange-300 w-11/12 mx-auto mb-6" />

      <p className="text-sm text-gray-500">
        © 2016 Amo Co., Ltd. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
