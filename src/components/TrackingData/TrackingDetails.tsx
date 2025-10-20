import React from "react";
import { Divider, Field } from "./TrackCompo";
import moment from "moment";

export const TrackingDetails = ({
  BookingDate,
  trackingDetails,
  trackingData,
}: {
  BookingDate: string;
  trackingDetails: any;
  trackingData: any;
}) => {
  const isoDateString = trackingDetails.currentStatusDate;
  const formattedDate = moment(isoDateString).format("DD MMM YYYY");

  // agar tracking history hai to variable me lo
  const containerHistory = trackingDetails.tracking_history || [];

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:text-lg ">
      {/* ===== Tracking Details ===== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 text-3xl">
        <Field label="Invoice Number" value={trackingDetails.invoiceId}/>
        <Field
          label="Container"
          value={
            trackingDetails.containerNumber
              ? trackingDetails.containerNumber
              : "-"
          }
        />
        <Field label="Booking Date" value={BookingDate} />
        <Field label="Receiver Name" value={trackingData.ReceiverName} />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 ml-[2px] ">
        <Field label="Sender Name" value={trackingData.SenderName} />
        <Field label="Receiver City" value={trackingData.ReceiverArea} />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 ml-[2px]">
        <Field label="Sender City" value={trackingData.SenderArea} />
        <Field label="Amount" value={trackingData.InvoiceTotal} />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 ml-[2px]">
        <Field label="Pieces" value={trackingDetails.pieces} />
        <Field label="Total Weight" value={trackingData.totalWeight} />
      </div>
   {/* ===== Tracking History ===== */}
      {containerHistory.length > 0 && (
        <div className="mt-5 border-t border-gray-200 pt-3">
          <h4 className="font-semibold text-gray-700 mb-2 ">
            Tracking History
          </h4>

          <ul className="space-y-2 ">
            {containerHistory.map((h: any, idx: number) => (
              <li
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 border border-gray-100 p-2 rounded-lg shadow-sm"
              >
                <span>
                  <span className="font-medium text-gray-700">
                    {moment(h.oldStatusDate).format("DD MMM YYYY")}
                  </span>{" "}
                  — {h.oldStatus}
                </span>
                <span className="text-gray-500">
                  Pieces: {h.pieces ?? "-"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* ===== Current Status ===== */}
      <div className="mt-3 text-3xl">
        <span className="font-medium">Current Status:</span>{" "}
        <span className="text-gray-500">{formattedDate} - </span>
        <a className="text-blue-700 hover:underline" href="#">
          {trackingDetails.currentStatus}
        </a>
      </div>

   
    </section>
  );
};
