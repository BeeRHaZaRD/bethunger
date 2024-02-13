import "@/assets/themes/mytheme/theme.scss"
import "@/assets/primeflex.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from "primevue/inputtext";
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from 'primevue/progressspinner';
import Menu from "primevue/menu";
import Badge from 'primevue/badge';
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import Slider from "primevue/slider";
import Dropdown from "primevue/dropdown";

export default {
    components: [
        Button,
        DataTable,
        Column,
        Dialog,
        OverlayPanel,
        InputText,
        InputNumber,
        Dropdown,
        Textarea,
        Slider,
        Calendar,
        Toast,
        Tag,
        Avatar,
        ProgressBar,
        ProgressSpinner,
        Menu,
        Badge
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
            dateFormat: 'dd.mm.yy'
        }
    }
}