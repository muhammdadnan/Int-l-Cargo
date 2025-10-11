import React from 'react'
import { Td, Th } from './TrackCompo';
import moment from 'moment'
export const TrackingHistory = ({trackingHistory}:{trackingHistory:any[]}) => {
    return (
    <section className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <Th>Sl. No.</Th>
                <Th>Date</Th>
                <Th>Invoice</Th>
                <Th>Pieces</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...trackingHistory].reverse().map((history,index) => {
                const isoDateString = history.oldStatusDate;
                const formattedDate = moment(isoDateString).format('DD MMM YYYY');
                return <tr key={index+1} className="hover:bg-gray-50/70">
                  <Td className="w-20">{index+1}</Td>
                  <Td className="whitespace-nowrap w-40">{formattedDate}</Td>
                  <Td className="w-20">{`${history.invoiceId}`}</Td>
                  <Td className="w-20">{history.pieces}</Td>
                  <Td className="whitespace-nowrap w-40">{history.oldStatus}</Td>
                  {/* <Td className="text-gray-600">{row.remarks}</Td> */}
                </tr>
})}
            </tbody>
          </table>
        </section>
  )
}
