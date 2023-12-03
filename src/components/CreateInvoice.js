import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';



export default function CreateInvoice(props) {
    const navigate = useNavigate();
    const auth = getAuth()

    var today = new Date(),
        date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    const [categories, setCategories] = useState([]);
    const [medTypes, setMedTypes] = useState([]);
    const [medName, setMedName] = useState([])
    const [user, setUser] = useState()
    const [showInvoiceLink, setShowInvoiceLink] = useState(false)

    const categoriesCollectionReference = collection(db, "medicine_categories");
    const medTypesCollectionRef = collection(db, "medicine_types");
    const medNameCollectionRef = collection(db, "medicine_inventory")
    const salesCollectionRef = collection(db, "Sales")

    const getCategories = async () => {
        const data = await getDocs(categoriesCollectionReference);
        setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getTypes = async () => {
        const data = await getDocs(medTypesCollectionRef);
        setMedTypes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getMedicineName = async () => {
        const data = await getDocs(medNameCollectionRef);
        setMedName(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const getUser = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                setUser(user.displayName)
                setInvoiceDetails((prev) => ({ ...prev, cashier: user.displayName, cashierId: user.uid }))
            }
        })
    }

    const addSales = async () => {
        await setDoc(doc(salesCollectionRef, invoiceDetails.cashierId), {
            name: invoiceDetails.cashier,
            sale: invoiceDetails.totalPrice,
        })
    }

    useEffect(() => {
        getCategories();
        getTypes();
        getMedicineName()
        getUser()
    }, []);
    const medicinesCollectionRef = collection(db, "medicine_inventory");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [medicine, setMedicine] = useState({
        name: "",
        power: "",
        category: "",
        type: "",
        price: "",
        stock: "",
    });
    const [selectedMedicine, setSelectedMedicine] = useState({
        name: "",
        power: "",
        category: "",
        type: "",
        price: "",
        stock: "",
    })
    const [invoiceDetails, setInvoiceDetails] = useState({
        InvoiceNumber: Math.floor(Math.random() * 10000),
        cashier: '',
        medName: selectedMedicine?.name,
        quantity: '',
        totalPrice: '',
        power: '',
        price: '',
        cashierId: ''
    })

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: '#FFF',
            padding: 16
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: 10
        },
        header: {
            fontWeight: 'bold',
            color: '#189CF1',
            fontSize: 50,
        },
        tableView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '10%',
            paddingHorizontal: 20,
        },
        tableHeader: {
            fontSize: 12,
            fontWeight: 'bold'
        }
    });

    const InvoiceDoc = () => {
        return (
            <Document>
                <Page size={"A4"}>
                    <View style={styles.mainContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.tableHeader}>Cashier: {invoiceDetails.cashier}</Text>
                            <Text style={styles.header}>Medicare</Text>
                            <Text style={styles.tableHeader}>Date: {date}</Text>

                        </View>

                        <View style={{ borderWidth: 1, borderColor: '#189CF1', width: '100%' }} />

                        <View style={styles.tableView}>
                            <Text style={styles.tableHeader}>Product</Text>
                            <Text style={styles.tableHeader}>Power</Text>
                            <Text style={styles.tableHeader}>Quantity</Text>
                            <Text style={styles.tableHeader}>Price</Text>
                        </View>
                        <View style={{ borderWidth: 1, width: '100%' }} />

                        <View style={styles.tableView}>
                            <Text style={styles.tableHeader}>{invoiceDetails.medName}</Text>
                            <Text style={styles.tableHeader}>{selectedMedicine.power}</Text>
                            <Text style={styles.tableHeader}>{invoiceDetails.quantity}</Text>
                            <Text style={styles.tableHeader}>{selectedMedicine.price}</Text>
                        </View>

                        <View style={[styles.tableView, { justifyContent: 'flex-end', marginTop: '70%' }]}>
                            <Text style={styles.tableHeader}>Total: </Text>
                            <Text style={styles.tableHeader}>${invoiceDetails.totalPrice}</Text>
                        </View>
                    </View>
                </Page>
            </Document>
        )
    }

    return (
        <>
            <div>
                <AdminHeader />
                <AdminSideBar />

                <div className="main-panel">

                    <div className="content">

                        <h5 className="page-title">Invoice</h5>
                    </div>

                    <div className="card">
                        <div className='card-body px-10 py-10'>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Invoice Number</label>
                                <div class="col-sm-10">
                                    <input type="text" readonly class="form-control" id="staticEmail" value={invoiceDetails.InvoiceNumber} />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Cashier</label>
                                <div class="col-sm-10">
                                    <input type="text" readonly class="form-control" id="staticEmail" value={user} />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="exampleFormControlSelect1" class="col-sm-2 col-form-label">Medicine Category</label>
                                <div class="col-sm-10">
                                    <select
                                        class="form-control"
                                        onChange={(event) =>
                                            setMedicine((prev) => ({ ...prev, category: event.target.value }))
                                        }
                                        id="exampleFormControlSelect1">
                                        <option value="">Select a Category...</option>
                                        {categories.map((category) => {
                                            return <option value={category.name}>{category.name}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div class='form-group row'>
                                <label for="exampleFormControlSelect2" class="col-sm-2 col-form-label">Medicine Type</label>
                                <div class='col-sm-10'>
                                    <select
                                        class="form-control"
                                        // onChange={(event) =>
                                        //     // setMedName((prev) => ({ ...prev, type: event.target.value }))
                                        // }
                                        id="exampleFormControlSelect2">
                                        <option value="">Select a Type...</option>
                                        {medTypes.map((medType) => {
                                            return <option value={medType.name}>{medType.name}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div class='form-group row'>
                                <label for="exampleFormControlSelect2" class="col-sm-2 col-form-label">Medicine Name</label>
                                <div class='col-sm-10'>
                                    <select
                                        class="form-control"
                                        onChange={(event) => {
                                            setSelectedMedicine(medName[event.target.value])
                                            setInvoiceDetails((prev) => ({ ...prev, medName: medName[event.target.value].name }))
                                        }}
                                        id="formSelectMedicineName">
                                        <option value="">Select a Medicine...</option>
                                        {medName.map((med, index) => {
                                            return <option value={index} key={med.id}>{med.name}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Power</label>
                                <div class="col-sm-10">
                                    <input type="text" readonly class="form-control" id="power" value={selectedMedicine.power} onChange={(val) => setInvoiceDetails((prev) => ({ ...prev, power: val.target.value }))} />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Price</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="price" value={selectedMedicine.price} onChange={(val) => setInvoiceDetails((prev) => ({ ...prev, price: val.target.value }))} />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Quantity</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="quantity" placeholder="Quantity" onChange={(val) => setInvoiceDetails((prev) => ({ ...prev, quantity: val.target.value, totalPrice: val.target.value * selectedMedicine.price }))} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Total Price</label>
                                <label for="staticEmail" class="col-sm-2 col-form-label">{`$${selectedMedicine.price && invoiceDetails.quantity ? invoiceDetails.quantity * selectedMedicine.price : ''}`}</label>
                            </div>
                            <div class="d-flex flex-row justify-content-center">
                                <button type="button" class="btn btn-primary mr-5" onClick={() => {
                                    {
                                        setShowInvoiceLink(true)
                                    }
                                    addSales()
                                }}
                                >
                                    Print</button>
                                {showInvoiceLink ?
                                    <div class="d-flex justify-content-center">
                                        <PDFDownloadLink document={<InvoiceDoc />} fileName="somename.pdf">
                                            {({ blob, url, loading, error }) =>
                                                loading ? 'Loading document...' : 'Download Invoice!'
                                            }
                                        </PDFDownloadLink>
                                    </div>
                                    : null}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>

    )

}