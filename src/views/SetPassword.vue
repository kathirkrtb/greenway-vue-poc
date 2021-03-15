<template>
  <div class="back">
    <div class="div-center">
      <div class="content-left">
        <div class="login-body">
          <div class="brand-wrapper text-center">
            <img src="../assets/img/logo.png" alt="logo" class="logo" />
            <h5>Update Password</h5>
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
                <label>New Password</label>
                <Field
                  name="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                />
                <div class="invalid-feedback">{{ errors.password }}</div>
              </div>

              <div class="form-group">
                <label>Confirm Password</label>
                <Field
                  name="confirm_password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirm_password }"
                />
                <div class="invalid-feedback">
                  {{ errors.confirm_password }}
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-success btn-block"
                :disabled="isSubmit"
              >
                Save
              </button>
              <h2 class="forgot-password text-left mt-2">
                <router-link to="/login" class="text-secondary"
                  >Login
                </router-link>
              </h2>
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
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { ref, getCurrentInstance } from "vue";

export default {
  name: "Login",
  components: {
    Form,
    Field,
  },
  setup() {
    const isSubmit = ref(false);
    const route = useRoute();
    const router = useRouter();
    const $toast = getCurrentInstance().proxy.$toast;

    const schema = Yup.object().shape({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });

    function toast(type, message) {
      $toast.show(message, {
        type: type,
        position: "top-right",
      });
    }

    const onSubmit = (values) => {
      isSubmit.value = true;
      values.token_key = route.params.id;
      // display form values on success
      api
        .common("/updatePassword")
        .post(values)
        .then(
          (res) => {
            isSubmit.value = false;
            if (res.data.success) {
              localStorage.setItem("_token", res.data.token);
              toast("success", res.data.message);
              router.push("/");
            } else {
              toast("error", res.data.message);
            }
            console.log("res", res);
          },
          (error) => {
            isSubmit.value = false;
            console.log(error);
            toast(
              "error",
              "Some error occured while updating data. Please try again!"
            );
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

