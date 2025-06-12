  import React, {useEffect, useState } from "react";
  import "./AccountSettingPage.scss";
  import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
  import { getUserById, updateUserById } from "../../services/userService";
  import { useBillingContext } from "../../utils/BillingContext";
  import { useParams } from "react-router-dom";

  const AccountSettingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userId = id ? Number(id) : null;
    const [accountInfo, setAccountInfo] = useState({
      avatar: "",
      username: "",
      fullName: "",
      email: "",
      address: "",
      phone: "",
      country: "",
      gender: "",
      zipCode: "",
    });

    const { billingInfo, setBillingInfo } = useBillingContext();

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

    const handleAccountSave = async () => {
      if (!userId) {
            alert("User ID không hợp lệ.");
            return;
          }

      const formData = new FormData();
      formData.append("user_name", accountInfo.username);
      formData.append("full_name", accountInfo.fullName);
      formData.append("email", accountInfo.email);
      formData.append("phone", accountInfo.phone);
      formData.append("region", accountInfo.country);
      formData.append("gender", accountInfo.gender);
      formData.append("address", accountInfo.address);
      formData.append("zip_code", accountInfo.zipCode);

      try {
        const res = await updateUserById(userId, formData);
        console.log("Account updated:", res);
        window.location.reload();
      } catch (err) {
        console.error("Update failed:", err);
        alert("Cập nhật không thành công. Vui lòng thử lại!");
      }
    };

  const handleBillingSave = async () => {
    if (!userId) {
      alert("User ID không hợp lệ.");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", `${billingInfo.firstName} ${billingInfo.lastName}`);
    formData.append("email", billingInfo.email);
    formData.append("phone", billingInfo.phone);
    formData.append("region", billingInfo.country);
    formData.append("address_billing", billingInfo.address);
    formData.append("zip_code", billingInfo.zipCode);
    formData.append("note", billingInfo.note);

    try {
      const res = await updateUserById(userId, formData);
      console.log("Billing updated:", res);
      window.location.reload();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Cập nhật không thành công. Vui lòng thử lại!");
    }
  };

    useEffect(() => {
      const fetchUser = async () => {
        if (!userId) {
          console.error("Không tìm thấy userId hợp lệ trong URL");
          return;
        }

        try {
          const data = await getUserById(userId);
          setAccountInfo({
            avatar: data.avatar || "",
            username: data.user_name || "",
            fullName: data.full_name || "",
            email: data.email || "",
            address: data.address || "",
            phone: data.phone || "",
            country: data.region || "",
            gender: data.gender?.toString() || "",
            zipCode: data.zip_code || "",
          });

          setBillingInfo({
            firstName: data.full_name?.split(" ").slice(0, -1).join(" ") || "",
            lastName: data.full_name?.split(" ").slice(-1)[0] || "",
            address: data.address_billing || "",
            country: data.region || "",
            zipCode: data.zip_code || "",
            email: data.email || "",
            phone: data.phone || "",
            note: data.note || "",
          });
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }, [userId, setBillingInfo]);


    return (
      <div className="account-setting-page">
        <div className="sidebar">
          <DashboardSidebar/>
        </div>

        <div className="main-content">
          <div className="section account-info">
            <h3>Account Setting</h3>
            <div className="profile-box">
              <img src={accountInfo.avatar || ""} 
                  alt="User Avatar" 
                  className="avatar" 
              />
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
                  <input type="email" value={accountInfo.email} onChange={(e) => handleInputChange("account", "email", e.target.value)} />
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
                  <label>Gender</label>
                  <select
                    value={accountInfo.gender}
                    onChange={(e) => handleInputChange("account", "gender", e.target.value)}
                  >
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Address</label>
                  <input value={accountInfo.address} onChange={(e) => handleInputChange("account", "address", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Zip Code</label>
                  <input value={accountInfo.zipCode} onChange={(e) => handleInputChange("account", "zipCode", e.target.value)} />
                </div>
              </div>
            </div>
            <button className="btn-save" onClick={handleAccountSave}>Save Changes</button>
          </div>

          <div className="section billing-info">
            <h3>Billing Address</h3>
            <div className="inputs">
              <div className="input-group">
                <label>First Name</label>
                <input value={billingInfo.firstName} onChange={(e) => handleInputChange("billing", "firstName", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input value={billingInfo.lastName} onChange={(e) => handleInputChange("billing", "lastName", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input value={billingInfo.phone} onChange={(e) => handleInputChange("billing", "phone", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={billingInfo.email} onChange={(e) => handleInputChange("billing", "email", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Address</label>
                <input value={billingInfo.address} onChange={(e) => handleInputChange("billing", "address", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Country/Region</label>
                <input value={billingInfo.country} onChange={(e) => handleInputChange("billing", "country", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Zip Code</label>
                <input value={billingInfo.zipCode} onChange={(e) => handleInputChange("billing", "zipCode", e.target.value)} />
              </div>
              <div className="input-group">
                <label>Note</label>
                <input value={billingInfo.note} onChange={(e) => handleInputChange("billing", "note", e.target.value)} />
              </div>
            </div>
            <button className="btn-save" onClick={handleBillingSave}>Save Changes</button>
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
