import React from 'react'
import { Td, Th } from './TrackCompo';
export const TrackingHistory = ({trackingHistory}:{trackingHistory:any[]}) => {
  // const history = [
  //   {
  //     sl: 1,
  //     date: "04 Sep 2025",
  //     location: "NEW DELHI–INDIA",
  //     status: "SHIPMENT CLEARED",
  //     remarks: "Shipment custom cleared on 04-09-2025",
  //   },
  //   {
  //     sl: 2,
  //     date: "01 Sep 2025",
  //     location: "NEW DELHI–INDIA",
  //     status: "WAITING FOR CUSTOM CLEARANCE",
  //     remarks: "—",
  //   },
  //   {
  //     sl: 3,
  //     date: "01 Sep 2025",
  //     location: "NEW DELHI–INDIA",
  //     status: "SHIPMENT ARRIVED AT NEW DELHI PORT",
  //     remarks: "—",
  //   },
  //   {
  //     sl: 4,
  //     date: "18 Aug 2025",
  //     location: "DAMMAM–HFO",
  //     status: "SHIPMENT MOVED TO NEW DELHI PORT",
  //     remarks: "—",
  //   },
  //   {
  //     sl: 5,
  //     date: "15 Aug 2025",
  //     location: "—",
  //     status: "SHIPMENT LOADED TO CONTAINER",
  //     remarks: "—",
  //   },
  //   {
  //     sl: 6,
  //     date: "08 Aug 2025",
  //     location: "HEAD OFFICE",
  //     status: "Received at booking station",
  //     remarks: "IND SHIP 220/2025, Mas",
  //   },
  // ];
    return (
    <section className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <Th>Sl. No.</Th>
                <Th>Date</Th>
                <Th>Container</Th>
                <Th>Invoice</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trackingHistory.map((history,index) => (
                <tr key={index+1} className="hover:bg-gray-50/70">
                  <Td className="w-20">{index+1}</Td>
                  <Td className="w-20">{history.oldStatusDate}</Td>
                  <Td className="w-56">{history.containerNumber}</Td>
                  <Td className="min-w-[220px]">{`${history.invoiceId}/${history.pieces}`}</Td>
                  <Td className="whitespace-nowrap w-40">{history.oldStatus}</Td>
                  {/* <Td className="text-gray-600">{row.remarks}</Td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
  )
}
