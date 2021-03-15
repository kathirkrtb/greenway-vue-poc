<template>
  <div class="back">
    <div class="div-center-login">
      <div class="content-left">
        <div class="login-body">
          <div class="brand-wrapper text-center">
            <img src="../assets/img/logo.png" alt="logo" class="logo" />
          </div>
        </div>

        <div class="login-box">
          <Form
            @submit="onSubmit"
            :validation-schema="schema"
            v-slot="{ errors }"
          >
            <div class="col-md-12">
              <div class="form-group">
                <label>Email</label>
                <Field
                  name="email"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                />
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                />
                <div class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <button
                type="submit"
                class="btn btn-success btn-block"
                :disabled="isSubmit"
              >
                Sign In
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { ref, getCurrentInstance } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  components: {
    Form,
    Field,
  },
  setup() {
    const isSubmit = ref(false);
    const router = useRouter();
    const $toast = getCurrentInstance().proxy.$toast;

    const schema = Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });

    const onSubmit = (values) => {
      isSubmit.value = true;
      api
        .common("/login")
        .post(values)
        .then(
          (res) => {
            isSubmit.value = false;
            if (res.data.success) {
              localStorage.setItem("_token", res.data.token);
              router.go("/");
              $toast.success(res.data.message, {
                position: "top-right",
              });
            } else {
              $toast.error(res.data.message, {
                position: "top-right",
              });
            }
          },
          (error) => {
            isSubmit.value = false;
            console.log(error);
            try {
              $toast.error(
                "Username or Password is incorrect. Please try again!",
                {
                  position: "top-right",
                }
              );
            } catch (err) {
              console.log(err);
            }
          }
        );
    };

    return {
      isSubmit,
      schema,
      onSubmit,
    };
  },
};
</script>

