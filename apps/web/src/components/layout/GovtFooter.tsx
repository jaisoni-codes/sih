import React from "react";
import { Link } from "react-router-dom";
import { useT } from "../../i18n/useT";

export const GovtFooter: React.FC = () => {
  const { t } = useT();

  return (
    <footer className="bg-[#0b1d33] text-slate-400 text-xs border-t border-[#163b5f] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Portal Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="/jharkhand_gov_logo.png"
                alt="Government of Jharkhand"
                className="w-14 h-14 object-contain shrink-0 drop-shadow-md"
              />
              <span className="font-heading font-bold text-sm text-slate-100">
                {t("footer_portal")}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t("footer_desc")}
            </p>
            <div className="text-[10px] text-slate-400">
              {t("footer_dept")}
            </div>
          </div>

          {/* Col 2: Participating Institutions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              {t("footer_institutions")}
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>Birla Institute of Technology (BIT Mesra, Ranchi)</li>
              <li>Indian Institute of Technology (IIT ISM Dhanbad)</li>
              <li>National Institute of Technology (NIT Jamshedpur)</li>
              <li>Birsa Agricultural University (BAU Kanke, Ranchi)</li>
              <li>Ranchi University & Kolhan University</li>
            </ul>
          </div>

          {/* Col 3: Mandates & Compliance */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              {t("footer_mandates")}
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• NEP 2020 Experiential Learning Framework</li>
              <li>• Jharkhand State Startup Policy 2026</li>
              <li>• Section 135 Companies Act (CSR Innovation)</li>
              <li>• PostGIS 4326 Geo-Spatial Standard</li>
              <li>• MeghRaj Cloud / NIC Security Compliance</li>
            </ul>
          </div>

          {/* Col 4: Helpdesk */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              {t("footer_helpdesk")}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t("footer_address")}
            </p>
            <p className="text-[11px] text-slate-300 font-mono">
              {t("footer_tollfree")}
            </p>
            <p className="text-[11px] text-slate-400">
              {t("footer_email")}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#163b5f] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>{t("footer_copyright")}</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-slate-300">{t("footer_terms")}</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">{t("footer_privacy")}</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">{t("footer_accessibility")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
