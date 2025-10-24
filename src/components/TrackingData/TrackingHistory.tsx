import React from 'react'
import { Td, Th } from './TrackCompo';
import moment from 'moment'
export const TrackingHistory = ({trackingHistory}:{trackingHistory:any[]}) => {
    return (
    <section className="mt-5 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-left text-3xl">
            <thead className="bg-blue-800 text-white ">
              <tr>
                <Th>Sl. No.</Th>
                <Th>Date</Th>
                <Th>Invoice</Th>
                <Th>Pieces</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100
            ">
              {[...trackingHistory].reverse().map((history,index) => {
                const isoDateString = history.oldStatusDate;
                const formattedDate = moment(isoDateString).format('DD MMM YYYY');
                return <tr key={index+1} className={`hover:bg-blue-100 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                  <Td className="w-20" >{index+1}</Td>
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
