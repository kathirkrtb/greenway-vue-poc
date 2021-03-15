<template>
  <Form
    @submit="onSubmit"
    :validation-schema="schema"
    v-slot="{ errors }"
    :initial-values="formValues"
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
          v-model="formValues.name"
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
          v-model="formValues.phone_number"
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
          v-model="formValues.email"
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
        <div v-if="formValues.photo">
          <img :src="formValues.photo" class="user-images" />
        </div>

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
          v-model="formValues.id_card_type"
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
          v-model="formValues.id_card_number"
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
        <div v-if="formValues.id_card_pdf">
          <a
            class="mx-auto p-3"
            download
            target="_blank"
            :href="formValues.id_card_pdf"
          >
            <i class="fa fa-download"> Download file</i>
          </a>
        </div>

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
import { ref, reactive, onMounted } from "vue";
import api from "../services/api";
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance } from "vue";

export default {
  name: "User",
  components: {
    Form,
    Field,
  },
  setup() {
    const router = useRouter();
    const $toast = getCurrentInstance().proxy.$toast;
    const route = useRoute();
    const loading = ref(true);
    const isSubmit = ref(false);
    const formValues = reactive({});

    const idCardTypeVal = ref("");

    const updateIdtype = (e) => {
      idCardTypeVal.value = e.target.value;
    };
    const schema = Yup.object().shape({
      name: Yup.string().required("Please enter Name"),

      phone_number: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),

      email: Yup.string()
        .required("Please enter Email")
        .email("Email is invalid"),

      id_card_type: Yup.string().required("Please enter ID card type"),

      id_card_number: Yup.string().required("Please enter ID card number"),
    });

    async function fetchData() {
      loading.value = true;
      api
        .common(`/${route.params.id}`)
        .get()
        .then((res) => {
          if (res.data.success) {
            //initialise the values
            let user = res.data.data;
            formValues.email = user.email;
            formValues.name = user.name;
            formValues.phone_number = user.mobile;
            formValues.id_card_number = user.id_card_number;
            formValues.email = user.email;
            formValues.id_card_type = user.id_card_type;
            formValues.photo = user.photo;
            formValues.id_card_pdf = user.id_card_pdf;
          }
          loading.value = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    onMounted(() => {
      fetchData();
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
      values.id_card_type = formValues.id_card_type;

      if (values.photo) {
        values.photo = await fileToBase64(values.photo[0]);
      }

      if (values.id_card_pdf) {
        values.id_card_pdf = await fileToBase64(values.id_card_pdf[0]);
      }

      if (idCardTypeVal.value) {
        values.id_card_type = idCardTypeVal.value;
      }

      const formData = { ...values };

      api
        .common(`/${route.params.id}`)
        .put(formData)
        .then(
          (res) => {
            console.log(res);
            isSubmit.value = false;
            if (res.data.success) {
              toast("success", "User updated successfully!");
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
              "Some error occured while updating data. Please try again!"
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

    return {
      isSubmit,
      schema,
      onSubmit,
      formValues,
      updateIdtype,
      ErrorMessage,
    };
  },
};
</script>
