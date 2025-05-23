// example
// import { useState } from 'react';

// export const useForm = <T extends Object>(initialValues: T) => {
//   const [values, setValues] = useState(initialValues);
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValues({ ...values, [e.target.name]: e.target.value });
//   };
//   return { values, handleChange };
// };