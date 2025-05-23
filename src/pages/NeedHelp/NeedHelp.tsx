import React, { useState } from 'react';
import './NeedHelp.scss';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'Hệ thống tải nội dung chậm có ảnh hưởng gì không?',
    answer:
      'Khi hệ thống tải nội dung chậm, người dùng có thể gặp trải nghiệm không tốt. Bạn nên kiểm tra tốc độ mạng hoặc liên hệ hỗ trợ kỹ thuật để được xử lý.',
  },
  {
    question: 'Cách xử lý lỗi hiển thị thông báo cảnh báo.',
    answer:
      'Nếu bạn thấy thông báo cảnh báo hiển thị sai, vui lòng thử làm mới trang hoặc xoá bộ nhớ cache trình duyệt.',
  },
  {
    question: 'Làm sao để đổi mật khẩu tài khoản?',
    answer:
      'Truy cập vào phần Tài khoản > Cài đặt bảo mật để thay đổi mật khẩu. Hãy chắc rằng bạn nhớ mật khẩu hiện tại.',
  },
  {
    question: 'Hệ thống không gửi mã xác thực qua email?',
    answer:
      'Hãy kiểm tra hộp thư rác/spam của bạn. Nếu không có mã, vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.',
  },
];

const NeedHelp: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="need-help-page">
      <div className="faq-container">
        <h2>Câu hỏi thường gặp</h2>
        <ul className="faq-list">
          {faqData.map((item, index) => (
            <li key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                {item.question}
                <span className="faq-toggle">{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && <div className="faq-answer">{item.answer}</div>}
            </li>
          ))}
        </ul>
      </div>
      <div className="support-form">
        <h3>Bạn chưa tìm thấy câu trả lời? Hỏi bộ phận hỗ trợ.</h3>
        <p>
          Điền thông tin của bạn vào biểu mẫu bên dưới. Bộ phận hỗ trợ sẽ phản hồi trong thời gian sớm nhất.
        </p>
        <form>
          <input type="email" placeholder="Địa chỉ email" required />
          <input type="text" placeholder="Tiêu đề" required />
          <textarea placeholder="Nội dung tin nhắn (không bắt buộc)" rows={4} />
          <button type="submit">GỬI TIN NHẮN</button>
        </form>
      </div>
    </div>
  );
};

export default NeedHelp;
