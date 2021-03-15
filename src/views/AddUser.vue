<template>
  <Form
    @submit="onSubmit"
    :validation-schema="schema"
    v-slot="{ errors }"
    enctype="multipart/form-data"
    method="post"
  >
    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required" for="email">Name</label>
      <div class="col-sm-7">
        <Field
          name="name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
        />
        <div class="invalid-feedback">{{ errors.name }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required">Phone Number</label>
      <div class="col-sm-7">
        <Field
          name="phone_number"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.phone_number }"
        />
        <div class="invalid-feedback">{{ errors.phone_number }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required">Email</label>
      <div class="col-sm-7">
        <Field
          name="email"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
        />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required">Photograph</label>
      <div class="col-sm-7">
        <Field
          name="photo"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': errors.photo }"
          accept="image/*"
        />
        <div class="invalid-feedback">{{ errors.photo }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required">ID card type</label>
      <div class="col-sm-7">
        <select
          name="id_card_type"
          class="form-control"
          :class="{ 'is-invalid': errors.id_card_type }"
          @change="updateIdtype"
        >
          <option value="Aadhaar">Aadhar Card</option>
          <option value="PAN">PAN Card</option>
          <option value="Passport">Passport</option>
          <option value="EPIC">Voter ID</option>
        </select>
        <div class="invalid-feedback">{{ errors.id_card_type }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required">ID card number</label>
      <div class="col-sm-7">
        <Field
          name="id_card_number"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.id_card_number }"
        />
        <div class="invalid-feedback">{{ errors.id_card_number }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-1"></div>
      <label class="col-sm-2 required">ID card Pdf</label>
      <div class="col-sm-7">
        <Field
          name="id_card_pdf"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': errors.id_card_pdf }"
          accept="application/pdf"
        />
        <div class="invalid-feedback">{{ errors.id_card_pdf }}</div>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-10 text-right">
        <router-link to="/" class="btn btn-secondary">Cancel</router-link>&nbsp;
        <button type="submit" class="btn btn-success" :disabled="isSubmit">
          Save
        </button>
      </div>
    </div>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { ref } from "vue";
import api from "../services/api";
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "User",
  components: {
    Form,
    Field,
  },
  setup() {
    const isSubmit = ref(false);
    const router = useRouter();
    const $toast = getCurrentInstance().proxy.$toast;
    const idCardTypeVal = ref("Aadhaar");
    const updateIdtype = (e) => {
      idCardTypeVal.value = e.target.value;
    };

    const schema = Yup.object().shape({
      name: Yup.string()
        .required("Please enter Name")
        .max(20, "Must be less than 20 digits"),

      phone_number: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),

      email: Yup.string()
        .required("Please enter Email")
        .email("Email is invalid"),

      photo: Yup.mixed().required("Please upload Photograph"),

      id_card_type: Yup.string().required("Please enter ID card type"),

      id_card_number: Yup.string()
        .required("Please enter ID card number")
        .max(20, "Must be less than 20 digits"),

      id_card_pdf: Yup.mixed().required("Please upload Id card"),
    });

    const fileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const onSubmit = async (values) => {
      isSubmit.value = true;

      const photo = await fileToBase64(values.photo[0]);
      const id_card_pdf = await fileToBase64(values.id_card_pdf[0]);
      values.id_card_type = idCardTypeVal.value;
      const formData = { ...values, photo, id_card_pdf };
      api
        .common("/create")
        .post(formData)
        .then(
          (res) => {
            isSubmit.value = false;
            if (res.data.success) {
              toast("success", res.data.message);
              router.push("/");
            } else {
              toast("error", res.data.message);
            }
          },
          (error) => {
            isSubmit.value = false;
            console.log(error);
            toast(
              "error",
              "Some error occured while saving data. Please try again!"
            );
          }
        );

      function toast(type, message) {
        $toast.show(message, {
          type: type,
          position: "top-right",
        });
      }
    };

    //Return datas
    return {
      isSubmit,
      ErrorMessage,
      schema,
      onSubmit,
      updateIdtype,
    };
  },
};
</script>