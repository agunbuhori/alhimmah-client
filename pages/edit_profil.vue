<template lang="pug">
    .content.with-tab.no-navbar
        .nav-tabs
            a(@click.prevent="form = 'biodata'" :class="{active: form === 'biodata'}") Biodata
            a(@click.prevent="form = 'auth'" :class="{active: form === 'auth'}") Informasi Login
        
        form.p-2(@submit.prevent="updateUser()" v-if="form === 'auth'")
            .form-group
                label Username
                input.form-control(v-model="user.name")
                span.text-danger.text-small(v-if="user_error.name" v-for="error in user_error.name") {{ error }}
            
            .form-group
                label Alamat email (harus aktif)
                input.form-control(v-model="user.email")
                span.text-danger.text-small(v-if="user_error.email" v-for="error in user_error.email") {{ error }}

            
            .form-group
                label Kata sandi
                input.form-control(type="password" v-model="user.password" placeholder="Minimal 5 karakter")
                span.text-danger.text-small(v-if="user_error.password" v-for="error in user_error.password") {{ error }}

            button.btn.btn-primary.btn-block Simpan   

            

        form.p-2(@submit.prevent="updateProfile()" v-if="form === 'biodata'")
            .alert.alert-warning.mb-2(v-if="! profile.member_id")
                h3 Perhatian
                | Nama, jenis kelamin, dan tanggal lahir hanya bisa diubah satu kali. Harap isi data tersebut dengan benar.

            .form-group
                label Nama Lengkap
                input.form-control(placeholder="Masukkan nama lengkap" v-model="profile.name" :disabled="profile.member_id" required)
                span.text-danger.text-small(v-if="profile_error.name" v-for="error in profile_error.name") {{ error }}
            
            .form-group
                label Jenis Kelamin
                select.form-control(v-model="profile.gender" :disabled="profile.member_id" required)
                    option(value="" :selected="! profile.gender") - Pilih jenis kelamin -
                    option(value="male") Ikhwan
                    option(value="female") Akhwat

            .form-group
                label Tanggal Lahir
                Datetime(v-model="profile.birthday" :disabled="profile.member_id" placeholder="Klik disini" required)

            .form-group
                label Nomor whatsapp
                VuePhoneNumberInput(
                    v-model="whatsapp" 
                    default-country-code="ID" 
                    :translations="translations"
                    @update="onUpdate"
                )

            .form-group
                label Negara
                select.form-control(v-model="country_code" @change="profile.province_id = ''")
                    option(v-for="country in countries" :value="country.country_code") {{ $string.title(country.country_name) }}

            .form-group(v-if="country_code === 'ID'")
                label Provinsi
                select.form-control(v-model="profile.province_id" @change="getCities()")
                    option(value="") - Pilih Provinsi -
                    option(v-for="province in provinces" :value="province.kode") {{ $string.title(province.nama) }}
            
            
            .form-group(v-if="country_code === 'ID' && profile.province_id")
                label Kota
                select.form-control(v-model="profile.city_id")
                    option(value="") - Pilih Kabupaten/Kota -
                    option(:value="city.kode" v-for="city in cities") {{ $string.title(city.nama) }}


            //- .form-group
            //-     label Alamat
            //-     textarea.form-control(v-model="profile.address" placeholder="Contoh : Jl. Wastukencana No. 31, RT/RW. 11/07, Babakan Ciamis, Sumur Bandung")

            
            button.btn.btn-primary.btn-block Simpan    
</template>

<script>
import { Settings } from 'luxon';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Settings.defaultLocale = 'id'


export default {
    middleware: 'auth',
    async asyncData({ $axios }) {
        const user = await $axios.$get('profile');
        const profile = user.profile;
        let whatsapp = profile.whatsapp;
        let country_code = profile.address_code && profile.address_code.match(/^[A-Z]+$/) ? profile.address_code : 'ID';
        const address_code = profile.address_code ? profile.address_code.split('.') : null;
        user.password = "";
        profile.province_id = address_code ? parseInt(address_code[0]) : "";
        profile.city_id = address_code ? profile.address_code : "";
        profile.gender = profile.gender === null ? "" : profile.gender;
        return { user, profile, whatsapp, country_code };
    },
    components: {
        Datetime,
        VuePhoneNumberInput
    },
    data() {
        return {
            form: 'biodata',
            province_id: [],
            countries: [],
            provinces: [],
            cities: [],
            user_error: {},
            profile_error: {},
            translations: {
                countrySelectorLabel: 'Kode negara',
                countrySelectorError: 'Choisir un pays',
                phoneNumberLabel: 'Nomor telepon',
                example: 'Contoh :'
            }
        }
    },
    mounted() {
        this.getCountries();
        this.getProvinces();

        if (this.profile.province_id !== "") {
            this.getCities();
        }
    },
    methods: {
        async getCountries() {
            const countries = await this.$axios.$get('countries');
            this.countries = countries;
        },

        async getProvinces() {
            const provinces = await this.$axios.$get('provinces');
            this.provinces = provinces;
            
        },

        async getCities() {
            await this.$axios.$get('cities?kode='+this.profile.province_id).then(response => {
                this.cities = response;

                if (this.profile.city_id.split('.')[0] != this.profile.province_id)
                    this.profile.city_id = "";
            });
        },

        updateProfile() {
            this.$axios.$put('update_profile', {
                ...this.profile,
                city_id: this.country_code === 'ID' ? this.profile.city_id : this.country_code
            })
            .then(response => {
                this.$router.push('/profil');
            })
            .catch(error => {
                this.profile_error = error.response.data.errors;
            })
        },

        updateUser() {
            this.$axios.$put('update_user', {
                ...this.user
            })
            .then(response => {
                this.$router.push('/profil');
            })
            .catch(error => {
                this.user_error = error.response.data.errors;
            })
        },


        onUpdate(payload) {
            this.profile.whatsapp = payload.formattedNumber;
        }
    }
}
</script>

<style lang="sass" scoped>
.vdatetime-input
    border: none !important
</style>