"use client";

import { Mail, MessageSquare, MapPin, Globe, Send, Zap, Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useWhatsAppSettings } from "@/lib/whatsapp";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const { settings: waSettings, whatsappUrl } = useWhatsAppSettings();
    const hasWhatsApp = waSettings.enabled && Boolean(waSettings.phoneNumber) && (waSettings.showContactPage ?? true) && Boolean(whatsappUrl);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 md:pt-36 pb-24">
            {/* Page Header */}
            <div className="bg-slate-900 text-white py-16 mb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest text-sky-400">24/7 GLOBAL SUPPORT</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Contact Transglobe Logistics</h1>
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Our team is here to help you with anything you need. Whether you have a question about consignment tracking or custom cargo quotes.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Contact Info Cards */}
                <div className={`grid grid-cols-1 ${hasWhatsApp ? 'md:grid-cols-3 max-w-6xl' : 'md:grid-cols-2 max-w-4xl'} gap-8 mb-16 mx-auto`}>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Mail size={26} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">EMAIL SUPPORT</span>
                        <h3 className="text-xl font-black text-slate-900">Official Email</h3>
                        <a href="mailto:info@transglobelogistics.org" className="text-blue-600 font-extrabold text-sm block hover:underline break-all">
                            info@transglobelogistics.org
                        </a>
                    </div>

                    {hasWhatsApp && (
                        <div className="bg-white p-8 rounded-3xl border-2 border-[#25D366]/40 shadow-md space-y-4 hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-[#25D366]">DIRECT MESSAGING</span>
                            <h3 className="text-xl font-black text-slate-900">WhatsApp Line</h3>
                            <p className="text-slate-600 text-sm font-bold">
                                {waSettings.displayLabel || waSettings.phoneNumber}
                            </p>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
                            >
                                Chat on WhatsApp ➔
                            </a>
                        </div>
                    )}

                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock size={26} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">HOURS</span>
                        <h3 className="text-xl font-black text-slate-900">Operating Hours</h3>
                        <p className="text-slate-600 text-sm font-semibold">
                            24/7 Satellite Global Dispatch & Waybill Tracking
                        </p>
                    </div>
                </div>

                {/* Form & Info Section */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 bg-slate-900 text-white p-10 md:p-14 flex flex-col justify-between relative">
                        <div className="space-y-6 relative z-10">
                            <span className="text-xs font-black uppercase tracking-widest text-sky-400">SEND A DIRECT INQUIRY</span>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Reach Out to Our Logistics Specialists
                            </h2>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                Fill out the form and our global support desk will respond promptly with consignment tracking or freight details.
                            </p>

                            <div className="space-y-4 pt-6 border-t border-slate-800 text-xs font-semibold text-slate-300">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-sky-400 shrink-0" />
                                    <span>Multimodal International Logistics Network</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap size={18} className="text-sky-400 shrink-0" />
                                    <span>Real-Time Satellite GPS Waybill Telemetry</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 p-10 md:p-14 bg-white">
                        {submitted ? (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-8 rounded-2xl text-center space-y-3">
                                <h3 className="text-2xl font-black">Message Received!</h3>
                                <p className="text-sm font-medium">Thank you for reaching out to Transglobe Logistics. Our support team will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                                            placeholder="e.g. John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                                            placeholder="e.g. Smith"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Consignment No. (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                                        placeholder="Ex: VTX948210394"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Your Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                                        placeholder="How can we assist your shipment today?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-800 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={16} />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
