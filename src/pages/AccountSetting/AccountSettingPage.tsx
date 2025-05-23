import React, { useState } from "react";
import "./AccountSettingPage.scss";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

const AccountSettingPage: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState({
    username: "devshop.name",
    fullName: "Kevin Gillbert",
    email: "kevin@themepure.net",
    secondaryEmail: "kevin02@dropmail.com",
    phone: "+1 202-555-0143",
    country: "Bangladesh",
    state: "Dhaka",
    zipCode: "1207",
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: "Kevin",
    lastName: "Gillbert",
    company: "Devshop Name (Technoholic)",
    address: "Road No: 05, House no: 1380/C Flat No. 50",
    country: "Bangladesh",
    region: "Bangladesh",
    city: "Dhaka",
    zipCode: "1207",
    email: "kevin.kd03@dropmail.com",
    phone: "+1 202-555-0143",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    section: string,
    field: string,
    value: string
  ) => {
    if (section === "account") {
      setAccountInfo({ ...accountInfo, [field]: value });
    } else if (section === "billing") {
      setBillingInfo({ ...billingInfo, [field]: value });
    } else if (section === "password") {
      setPasswordInfo({ ...passwordInfo, [field]: value });
    }
  };

  return (
    <div className="account-setting-page">
      <div className="sidebar">
        <DashboardSidebar selected="Settings" />
      </div>

      <div className="main-content">
        <h2>Account Settings</h2>

        <div className="section account-info">
          <h3>Account Setting</h3>
          <div className="profile-box">
            <img src="https://lh3.googleusercontent.com/a/ACg8ocJzRHLp7CfAxW4i0GG52mSYTMY7jqd_G_WctCYtbnnu_zlhg-CK=s360-c-no" alt="User Avatar" className="avatar" />
            <div className="inputs">
              <div className="input-group">
                <label>Username</label>
                <input value={accountInfo.username} onChange={(e) => handleInputChange("account", "username", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <input value={accountInfo.fullName} onChange={(e) => handleInputChange("account", "fullName", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input value={accountInfo.email} onChange={(e) => handleInputChange("account", "email", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Secondary Email</label>
                <input value={accountInfo.secondaryEmail} onChange={(e) => handleInputChange("account", "secondaryEmail", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input value={accountInfo.phone} onChange={(e) => handleInputChange("account", "phone", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Country/Region</label>
                <input value={accountInfo.country} onChange={(e) => handleInputChange("account", "country", e.target.value)} />
              </div>
              <div className="input-group">
                <label>State</label>
                <input value={accountInfo.state} onChange={(e) => handleInputChange("account", "state", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Zip Code</label>
                <input value={accountInfo.zipCode} onChange={(e) => handleInputChange("account", "zipCode", e.target.value)} />
              </div>
            </div>
          </div>
          <button className="btn-save">Save Changes</button>
        </div>

        <div className="section billing-info">
          <h3>Billing Address</h3>
          <div className="inputs">
            {/* Similar input-groups for billingInfo fields */}
            {Object.entries(billingInfo).map(([field, value]) => (
              <div key={field} className="input-group">
                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                <input
                  value={value}
                  onChange={(e) => handleInputChange("billing", field, e.target.value)}
                />
              </div>
            ))}
          </div>
          <button className="btn-save">Save Changes</button>
        </div>

        <div className="section change-password">
          <h3>Change Password</h3>
          <div className="inputs">
            <div className="input-group">
              <label>Current Password</label>
              <input type="password" value={passwordInfo.currentPassword} onChange={(e) => handleInputChange("password", "currentPassword", e.target.value)} />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" value={passwordInfo.newPassword} onChange={(e) => handleInputChange("password", "newPassword", e.target.value)} />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" value={passwordInfo.confirmPassword} onChange={(e) => handleInputChange("password", "confirmPassword", e.target.value)} />
            </div>
          </div>
          <button className="btn-save">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingPage;
