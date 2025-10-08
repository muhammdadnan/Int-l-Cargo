import React from 'react'
import { Divider, Field } from './TrackCompo'
import moment from 'moment'
export const TrackingDetails = (
  {BookingDate,trackingDetails,trackingData}:
  {BookingDate:string,
    trackingDetails:any,trackingData:any}) => {
      
      const isoDateString = trackingDetails.currentStatusDate;

      const formattedDate = moment(isoDateString).format('DD MMM YYYY');

  return (
                <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Invoice Number" value={trackingDetails.invoiceId} />
                    <Field label="Container" value={trackingDetails.containerNumber?trackingDetails.containerNumber:"-"} />
                    <Field label="Booking Date" value={BookingDate} />
                    <Field label="" value="" />
                  </div>
        
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Sender Name" value={trackingData.SenderName} />
                    <Field label="Receiver Name" value={trackingData.ReceiverName} />
                    {/* <Field label="Docket Number" value={'—'} /> */}
                  </div>
        
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                     <Field label="Sender City" value={trackingData.SenderArea} />
                    <Field label="Receiver City" value={trackingData.ReceiverArea} />
                  </div>
        
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* <Field
                      label="Local Transporter"
                      value={'—'}
                      link
                    /> */}
                    {/* <Field label="Total Weight" value={"48"} /> */}
                    <Field label="Pieces" value={trackingDetails.pieces} />
                  </div>
        
                  {/* Current status */}
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Current Status:</span>{" "}
                    <span className="text-gray-500">
                      {formattedDate} -{" "}
                    </span>
                    <a className="text-blue-700 hover:underline" href="#">
                      {trackingDetails.currentStatus}
                    </a>
                  </div>
                </section>
        
   
  )
}
