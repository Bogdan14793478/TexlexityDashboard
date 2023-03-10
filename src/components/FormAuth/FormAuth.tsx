import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { AuthFormData } from "./types";

import classes from "./styles.module.css";
import { ErrorMsg, Labels } from "../../helpers/constants";
import { signUp } from "../../app/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userIsAuth } from "../../redux/actions/typeActionUser";
import { useAppSelector } from "../../hooks";
import clsx from "clsx";

const initialValues: AuthFormData = {
  name: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(ErrorMsg.resultRequired),
  password: Yup.string()
    .min(6, ErrorMsg.checkShortPassword)
    .max(16, ErrorMsg.checkLongPassword)
    .required(ErrorMsg.resultRequired),
});

export const FormAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useAppSelector((state) => state.user.isAuth);
  function redirectToHome() {
    dispatch(userIsAuth(true));
  }

  const handleClickLogin = async (data: AuthFormData) => {
    const isAdmin = await signUp(data);
    if (isAdmin) {
      redirectToHome();
      navigate("/user-management");
    }
  };

  const onSubmit = (
    values: AuthFormData,
    props: FormikHelpers<AuthFormData>
  ): void => {
    console.log(values, "values");
    handleClickLogin(values);
    props.resetForm();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount
      >
        {({ errors, values, handleChange, dirty, isValid }) => (
          <Form>
            <div className={classes.form_field}>
              <label htmlFor="User name" className={classes.textAuth}>
                {Labels.userName}
                <input
                  className={clsx(classes.inputAuth, {
                    [classes.inputError]: errors.name,
                  })}
                  type="name"
                  id="name"
                  autoComplete="name"
                  name="name"
                  required
                  value={values.name}
                  onChange={handleChange}
                />
                {errors.name !== "Required" && (
                  <div className={classes.error}>{errors.name}</div>
                )}
              </label>
            </div>
            <div className={classes.form_field}>
              <label htmlFor="Password" className={classes.textAuth}>
                {Labels.password}
                <input
                  className={clsx(classes.inputAuth, {
                    [classes.inputError]: errors.password,
                    [classes.inputSuccess]: !errors.password,
                  })}
                  type="password"
                  id="password"
                  autoComplete="password"
                  name="password"
                  required
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password !== "Required" && (
                  <div className={classes.error}>{errors.password}</div>
                )}
              </label>

              <button
                type="submit"
                disabled={!(isValid && dirty)}
                className={classes.btnLogIn}
              >
                {Labels.logIn}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
