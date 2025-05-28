import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Frame5 from "../Images/Frame5.png";
import Left from './Left';
import { color } from 'framer-motion';
import App from './App.css'
export default function UserForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        useOfTobaco: '',
        gender: '',
        zip: '',
        state: '',
        age: '',
    });

    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Convert to uppercase ONLY for 'state'
        const processedValue = name === 'state' 
          ? value.toUpperCase() 
          : value;
      
        setFormData({ 
          ...formData, 
          [name]: processedValue 
        });
      };

    const handleOptionSelect = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.useOfTobaco) newErrors.useOfTobaco = 'Tobacco use is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!/^\d{5}$/.test(formData.zip)) newErrors.zip = 'Invalid ZIP code';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!/^\d+$/.test(formData.age) || parseInt(formData.age) < 1) newErrors.age = 'Invalid age';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            navigate('/chat', { state: formData });
        }
    };

    return (
        <div style={{ display: "flex", backgroundColor: "#FAFAFA" }}>
            {/* Left Side */}

                    <div style={{ display: "flex", height: "100vh", width: "40%" }}>
                <div style={{
                    margin: "20px",
                    borderRadius: "12px",
                    background: "linear-gradient(to left, #EEE9E0, #ECEEF2)",
                    backdropFilter: "blur(32px)",
                    height: "96vh"
                }}>
                    <div style={{ display: "flex", marginTop: "236px", marginLeft: "55px", justifyContent: "flex-start" }}>
                        <img src={Frame5} style={{ width: '24px', height: '24px' }} alt="Logo" />
                        <div style={{ fontSize: "24px", marginLeft: "6px" }}>Insurio</div>
                    </div>
                    <div style={{ fontSize: "32px", marginLeft: "55px", marginTop: "22px", marginRight: "189px" }}>
                        Smart Health Coverage, Simplified
                    </div>
                    <div style={{ fontSize: "16px", marginLeft: "55px", marginTop: "8px", color: "#A0A0A0", marginRight: "189px" }}>
                        Insurio streamlines health insurance by offering personalized plans and effortless management in one easy-to-use platform.
                    </div>
                </div>
            </div>
                    {/* ... (existing left side content) */}

            {/* Right Side */}
            <div style={{ width: "60%" }}>
                <form onSubmit={handleSubmit} style={{ marginTop: "146px", marginLeft: "62px", width: "627px" }}>
                    <div style={{ fontSize: "24px" }}>
                        Let us know about you
                    </div>
                    <div style={{ fontSize: "16px", marginTop: "8px", color: "#A0A0A0" }}>
                        These informations helps us to align with your best health insurance fit
                    </div>

                    {/* First Name & Last Name */}
                    <div style={{ display: "flex", marginTop: "24px" }}>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "297.5px" }}>
                                <label style={{ fontSize: "16px" }}>First name</label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder='Michael'
                                    style={{ ...inputStyle ,width:"287.5px", padding:"0px 0px 0px 10px"}}

                                />
                                {errors.firstName && <ErrorText text={errors.firstName} />}
                            </div>
                            <div style={{ width: "297.5px", marginLeft:"32px"}}>
                                <label style={{ fontSize: "16px" }}>Last name</label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder='Jackson'
                                    style={{ ...inputStyle , width:"287.5px", padding:"0px 0px 0px 10px"}}
                                />
                                {errors.lastName && <ErrorText text={errors.lastName} />}
                            </div>
                        </div>
                    </div>

                    {/* Tobacco Use */}
                    <div style={{ marginTop: "24px" }}>
                        <label style={{ fontSize: "16px" }}>Use of Tobacco</label>
                        <div style={{ display: "flex", gap: "10px", marginTop: "13px", color:"#A0A0A0" }}>
                            {['Never used', 'Former user', 'Occasionally', 'Daily user'].map((option) => (
                                <OptionButton
                                    key={option}
                                    label={option}
                                    
                                    selected={formData.useOfTobaco === option}
                                    onClick={() => handleOptionSelect('useOfTobaco', option)}
                                />
                            ))}
                        </div>
                        {errors.useOfTobaco && <ErrorText text={errors.useOfTobaco} />}
                    </div>

                    {/* Gender */}
                    <div style={{ marginTop: "24px" }}>
                        <label style={{ fontSize: "16px" }}>Gender</label>
                        <div style={{ display: "flex", gap: "12px", marginTop: "13px"}}>
                            {['Male', 'Female'].map((gender) => (
                                <OptionButton
                                    key={gender}
                                    label={gender}
                                    selected={formData.gender === gender}
                                    onClick={() => handleOptionSelect('gender', gender)}
                                    color="#A0A0A0"
                                    width="307.5px"
                                    height="80px"
                                />
                            ))}
                        </div>
                        {errors.gender && <ErrorText text={errors.gender} />}
                    </div>

                    {/* Zip & State */}
                    <div style={{ marginTop: "24px" }}>
                        <div style={{ display: "flex", gap: "32px" }}>
                            <div style={{ width: "297.5px" }}>
                                <label style={{ fontSize: "16px" }}>Zipcode</label>
                                <input
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    placeholder='00000'
                                    style={{ ...inputStyle,width:"287.5px", padding:"0px 0px 0px 10px"}}
                                />
                                {errors.zip && <ErrorText text={errors.zip} />}
                            </div>
                            <div style={{ width: "297.5px" }}>
                                <label style={{ fontSize: "16px" }}>State</label>
                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder='XX'
                                    style={{ ...inputStyle , width:"287.5px", padding:"0px 0px 0px 10px"}}
                                />
                                {errors.state && <ErrorText text={errors.state} />}
                            </div>
                        </div>
                    </div>

                    {/* Age */}
                    <div style={{ marginTop: "24px" }}>
                    <div style={{ width: "297.5px" }}>
                        <label style={{ fontSize: "16px" }}>Age</label>
                        <input
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="00"
                            style={{ ...inputStyle,width:"287.5px", padding:"0px 0px 0px 10px" }}
                        />
                        {errors.age && <ErrorText text={errors.age} />}
                    </div>

                    </div>
                    
                    {/* Submit Button */}
                    <button type="submit" style={{
                        marginTop: "45px",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "16px",
                        color: "#FFFFFF",
                        backgroundColor: "#000000",
                        height: "38px",
                        width: "297.5px",
                        cursor: "pointer"
                    }}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

const OptionButton = ({ label, selected, onClick, width = "149.25px" }) => (
    <div
        onClick={onClick}
        style={{
            cursor: "pointer",
            borderRadius: "4px",
            backgroundColor: selected ? "#e0e0e0" : "#f0f0f0",
            transition: "background 0.3s",
            color: selected ?  "#000000":"#A0A0A0",
            width:"307.5px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}
    >
        {label}
    </div>
);

const ErrorText = ({ text }) => (
    <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
        {text}
    </div>
);

const inputStyle = {
    borderRadius: "4px",
    backgroundColor: "#f0f0f0",
    marginTop: "13px",
    border: "none",
    fontSize: "16px",
    color: "#000000",
    height: "38px",
    width: "100%",
    outline: "none",
};