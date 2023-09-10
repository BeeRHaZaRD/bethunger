// import "primevue/resources/themes/lara-dark-blue/theme.css"
import "@/assets/themes/mytheme/theme.scss"
import "@/assets/primeflex.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"


import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import DynamicDialog from 'primevue/dynamicdialog';
import OverlayPanel from 'primevue/overlaypanel';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import Sidebar from 'primevue/sidebar';
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import ProgressBar from "primevue/progressbar";

export default {
    components: [
        Button,
        DataTable,
        Column,
        Dialog,
        DynamicDialog,
        OverlayPanel,
        InputNumber,
        Toast,
        Sidebar,
        Tag,
        Avatar,
        ProgressBar
    ],
    config: {
        locale: {
            today: "Сегодня",
            clear: "Очистить",
            dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            weak: 'Неделя',
            weekHeader: 'Нед',
            firstDayOfWeek: 1,
        }
    }
}