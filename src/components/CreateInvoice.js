import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";

export default function CreateInvoice(props) {

    return (
        <div>
            <AdminHeader />
            <AdminSideBar />

            <div className="main-panel">
                <div className="content">
                        <h5 className="page-title">Invoice</h5>
                </div>
            </div>
        </div>
    )
}