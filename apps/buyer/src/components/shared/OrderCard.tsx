'use client';

import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

interface OrderCardProps {
  orderId: string;
  date: string;
  status: string;
  total: string;
  itemCount: number;
}

export default function OrderCard({ orderId, date, status, total, itemCount }: OrderCardProps) {
  const getStatusConfig = (s: string) => {
    switch (s.toUpperCase()) {
      case 'DELIVERED': 
        return { cls: 'bg-lime-100 text-lime-700 border-lime-200', icon: CheckCircle2 };
      case 'PENDING': 
      case 'PLACED':
        return { cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock };
      case 'SHIPPED': 
        return { cls: 'bg-sky-100 text-sky-700 border-sky-200', icon: Truck };
      case 'CANCELLED':
        return { cls: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle };
      default: 
        return { cls: 'bg-gray-100 text-gray-700 border-gray-200', icon: Package };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Package className="w-7 h-7 text-gray-900 stroke-[1.5px]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Order #{orderId}</h3>
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${statusConfig.cls} flex items-center gap-1.5`}>
              <StatusIcon className="w-3 h-3" />
              {status}
            </span>
          </div>
          <p className="text-sm text-gray-400 font-bold tracking-tight">
            {date} • <span className="text-gray-900">{itemCount} pharmaceutical items</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:flex flex-col">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 font-sans">Total Bill</p>
          <span className="text-2xl font-black text-gray-950 tracking-tighter">{total}</span>
        </div>
        <div className="w-10 h-10 bg-gray-50 group-hover:bg-lime-300 rounded-xl flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}
