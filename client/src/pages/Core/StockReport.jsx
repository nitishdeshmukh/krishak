"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { ReportTableSection } from "@/components/ui/report-table";

export default function StockReport() {
  const { t } = useTranslation(["reports", "common"]);

  // Mock data - replace with actual API data
  const stockData = {
    paddy: { mota: 0, patla: 0, sarna: 0, mahamaya: 0, rbGold: 0 },
    rice: { mota: 0, patla: 0 },
    byproducts: { khanda: 0, kodha: 0, nakkhi: 0, silkyKodha: 0, bhusa: 0 },
    sacks: {
      filled: { new: 0, old: 0, plastic: 0 },
      empty: { new: 0, old: 0, plastic: 0 },
    },
    other: { frk: 0 },
  };

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <ArchiveBoxIcon className="h-7 w-7 text-primary" />
          स्टॉक रिपोर्ट (Stock Report)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          वर्तमान इन्वेंटरी और स्टॉक स्तर
        </p>
      </div>

      {/* Main Stock Table Container */}
      <div className="space-y-6">
        {/* Paddy Stock Section */}
        <ReportTableSection title="धान स्टॉक (क्विंटल में)" theme="amber">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  धान (मोटा)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  धान (पतला)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  धान (सरना)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  धान (महामाया)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">
                  धान (RB GOLD)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.paddy.mota}
                </td>
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.paddy.patla}
                </td>
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.paddy.sarna}
                </td>
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.paddy.mahamaya}
                </td>
                <td className="px-4 py-3 text-base font-medium">
                  {stockData.paddy.rbGold}
                </td>
              </tr>
            </tbody>
          </table>
        </ReportTableSection>

        {/* Rice Stock Section */}
        <ReportTableSection title="चावल स्टॉक" theme="green">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/2">
                  चावल (मोटा)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/2">
                  चावल (पतला)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.rice.mota}
                </td>
                <td className="px-4 py-3 text-base font-medium">
                  {stockData.rice.patla}
                </td>
              </tr>
            </tbody>
          </table>
        </ReportTableSection>

        {/* ByProduct Stock Section */}
        <ReportTableSection title="ByProduct स्टॉक" theme="blue">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  खंडा (क्विंटल में)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  कोढ़ा (क्विंटल में)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  नक्खी (क्विंटल में)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border">
                  सिल्की कोढ़ा (क्विंटल में)
                </th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">
                  भूसा (टन में)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.byproducts.khanda}
                </td>
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.byproducts.kodha}
                </td>
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.byproducts.nakkhi}
                </td>
                <td className="px-4 py-3 text-base font-medium border-r border-border">
                  {stockData.byproducts.silkyKodha}
                </td>
                <td className="px-4 py-3 text-base font-medium">
                  {stockData.byproducts.bhusa}
                </td>
              </tr>
            </tbody>
          </table>
        </ReportTableSection>

        {/* Sack Stock Section */}
        <section className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="bg-purple-50 dark:bg-purple-950/20 px-4 py-2.5 border-b border-purple-200 dark:border-purple-900">
            <h2 className="text-base font-semibold text-purple-900 dark:text-purple-100">
              बारदाना स्टॉक
            </h2>
          </div>

          {/* Filled Sacks Subsection */}
          <div className="border-b border-border">
            <div className="bg-purple-25 px-4 py-2 bg-muted/30">
              <h3 className="text-sm font-medium text-foreground">
                धान से भरे बारदाने
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/3">
                    बारदाना (नया)
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/3">
                    बारदाना (पुराना)
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/3">
                    बारदाना (प्लास्टिक)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 text-base font-medium border-r border-border">
                    {stockData.sacks.filled.new}
                  </td>
                  <td className="px-4 py-3 text-base font-medium border-r border-border">
                    {stockData.sacks.filled.old}
                  </td>
                  <td className="px-4 py-3 text-base font-medium">
                    {stockData.sacks.filled.plastic}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Empty Sacks Subsection */}
          <div>
            <div className="bg-purple-25 px-4 py-2 bg-muted/30">
              <h3 className="text-sm font-medium text-foreground">
                खाली बारदाने
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/3">
                    बारदाना (नया)
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/3">
                    बारदाना (पुराना)
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/3">
                    बारदाना (प्लास्टिक)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 text-base font-medium border-r border-border">
                    {stockData.sacks.empty.new}
                  </td>
                  <td className="px-4 py-3 text-base font-medium border-r border-border">
                    {stockData.sacks.empty.old}
                  </td>
                  <td className="px-4 py-3 text-base font-medium">
                    {stockData.sacks.empty.plastic}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Other Stock Section */}
        <ReportTableSection title="अन्य स्टॉक" theme="orange">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">
                  FRK
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-base font-medium">
                  {stockData.other.frk}
                </td>
              </tr>
            </tbody>
          </table>
        </ReportTableSection>
      </div>
    </div>
  );
}
