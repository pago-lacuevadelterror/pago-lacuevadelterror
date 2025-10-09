"use client";

import Image from "next/image";

export default function RightPanel({ monto = 150 }: { monto?: number }) {
  return (
    <aside className="order-1 md:order-2 mb-6 md:mb-0">
      <div className="flex items-center justify-between md:justify-start md:gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-lacueva.png"
            alt="La cueva del terror"
            width={36}
            height={36}
            className="rounded-full border border-[#ddd]"
          />
          <span className="text-[15px] font-medium">La cueva del terror</span>
        </div>
      </div>

      <div className="bg-white rounded-md border border-[#ddd] p-5 shadow-sm">
        {/* Mobile: solo “Link de pago” */}
        <div className="flex items-center justify-between md:hidden">
          <p className="text-[14px] text-[#555]">Link de pago</p>
          <p className="text-[14px] font-medium text-[#111]">S/. {monto}</p>
        </div>

        {/* Desktop: Detalles del pago completo */}
        <div className="hidden md:block">
          <p className="text-[15px] font-semibold mb-4">Detalles del pago</p>
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#555]">Link de pago</p>
            <p className="text-[14px] font-medium text-[#111]">S/. {monto}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
