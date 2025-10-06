import React from 'react'
import { Divider, Field } from './TrackCompo'

interface invoiceProps{
    number: string,
    date: string,
    bookingOffice: string,
    sender: string,
    receiver: string,
    docketNo: string,
    toLocation: string,
    localTransporter: string,
    totalWeight: string,
    pieces: number,
    currentStatusDate:string,
    currentStatus: string,
}
export const TrackingDetails = ({invoice}:{invoice:invoiceProps}) => {
  return (
    <>
        <h1 className="mt-3 text-center text-xl font-semibold">
                  Tracking Details for{" "}
                  <span className="text-blue-700">{invoice.number}</span>
                </h1>
        
                <Divider className="mx-auto mt-2 max-w-xs" />
        
                {/* Details card */}
                <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Invoice Number" value={invoice.number} link />
                    <Field label="Invoice Date" value={invoice.date} link />
                    <Field label="Booking Office" value={invoice.bookingOffice} link />
                    <Field label="" value="" link />
                  </div>
        
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Sender Name" value={invoice.sender} link />
                    <Field label="Receiver Name" value={invoice.receiver} link />
                    <Field label="Docket Number" value={invoice.docketNo} link />
                  </div>
        
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Booking Office" value={invoice.bookingOffice} link />
                    <Field label="To Location" value={invoice.toLocation} link />
                  </div>
        
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field
                      label="Local Transporter"
                      value={invoice.localTransporter}
                      link
                    />
                    <Field label="Total Weight" value={invoice.totalWeight} link />
                    <Field label="Pieces" value={String(invoice.pieces)} link />
                  </div>
        
                  {/* Current status */}
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Current Status:</span>{" "}
                    <span className="text-gray-500">
                      {invoice.currentStatusDate} -{" "}
                    </span>
                    <a className="text-blue-700 hover:underline" href="#">
                      {invoice.currentStatus}
                    </a>
                  </div>
                </section>
        
    </>
  )
}
