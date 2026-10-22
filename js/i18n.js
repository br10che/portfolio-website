/* ============================================================
   i18n.js — English / Greek / Russian
   "i18n" is short for "internationalisation" (i + 18 letters + n).

   How it works:
   - Every piece of text in index.html that should change has a
     data-i18n="some.key" attribute (or data-i18n-aria for labels
     that only screen readers hear).
   - English is the text already written in index.html. When the
     page loads we remember it, so switching back to English works.
   - Greek and Russian live in the `translations` object below.
     Some values contain HTML (<strong>, <span>, <br>) on purpose.
   - The choice is saved in localStorage. A link like
     violasanyan.com/?lang=ru opens the page straight in Russian.
   - script.js asks for the few strings it writes itself
     (typewriter words, "copied ✓") through i18n.t().
   ============================================================ */

const translations = {
    /* English strings that are NOT in index.html (used by script.js) */
    en: {
        'hero.roles': ['data cleanup', 'product enrichment', 'linux', 'IT support', 'cybersecurity'],
        'hero.hintTouch': 'tap to scatter',
        'contact.copied': 'copied ✓',
    },

    el: {
        'nav.about': 'σχετικά',
        'nav.journey': 'διαδρομή',
        'nav.skills': 'δεξιότητες',
        'nav.projects': 'projects',
        'nav.contact': 'επικοινωνία',

        'hero.title': 'καλύτερα δεδομένα προϊόντων<br> <span class="accent">για e&#8209;shops φαρμακείων</span>',
        'hero.desc': 'Φοιτήτρια Επιστήμης Υπολογιστών. Παράλληλα με τις σπουδές μου έχω δουλέψει σε φαρμακείο και στο e-commerce, γι’ αυτό μου αρέσει να φτιάχνω πράγματα που κάνουν τα πραγματικά δεδομένα πιο εύκολα στη χρήση.',
        'hero.focused': 'εστιάζω σε →',
        'hero.roles': ['καθαρισμό δεδομένων', 'εμπλουτισμό προϊόντων', 'linux', 'IT υποστήριξη', 'κυβερνοασφάλεια'],
        'hero.sayHi': 'γράψε μου',
        'hero.seeProjects': 'δες τα projects μου',
        'hero.hint': 'κούνησε το ποντίκι εδώ · κάνε κλικ για να σκορπίσουν',
        'hero.hintTouch': 'πάτησε για να σκορπίσουν',

        'nav.pharmacies': 'για φαρμακεία',
        'ph.title': 'για φαρμακεία',
        'ph.big': 'Τα προϊόντα σας αξίζουν κάτι παραπάνω από ένα όνομα και μια τιμή. <span class="accent">Τα ετοιμάζω για να πουλάνε online.</span>',
        'ph.intro': 'Ανοίγετε e-shop ή μπαίνετε στο Wolt ή σε άλλη εφαρμογή delivery; Τα περισσότερα συστήματα φαρμακείων έχουν μόνο ένα σύντομο όνομα, ένα barcode και μια τιμή. Ο πελάτης online χρειάζεται πολύ περισσότερα πριν αγοράσει. Τα ετοιμάζω εγώ για εσάς, προϊόν προς προϊόν, ώστε τα ράφια σας να δείχνουν online το ίδιο καλά όπως και στο κατάστημα.',
        'ph.c1Title': 'Καθαρές περιγραφές',
        'ph.c1Text': 'Τι είναι το προϊόν, για ποιον είναι και πώς βοηθάει, γραμμένο ώστε ο πελάτης να το καταλαβαίνει σε λίγα δευτερόλεπτα.',
        'ph.c2Title': 'Σωστές φωτογραφίες',
        'ph.c2Text': 'Καθαρές, ομοιόμορφες φωτογραφίες για κάθε προϊόν, ελεγμένες με το barcode, ώστε να δείχνουν πάντα το σωστό προϊόν, μέγεθος και απόχρωση.',
        'ph.c3Title': 'Συστατικά &amp; τρόπος χρήσης',
        'ph.c3Text': 'Πλήρης λίστα συστατικών, δραστικά συστατικά, τρόπος χρήσης και προειδοποιήσεις, από τις επίσημες πληροφορίες της μάρκας.',
        'ph.c4Title': 'Οργανωμένος κατάλογος',
        'ph.c4Text': 'Σωστά ονόματα και μεγέθη, χωρίς διπλότυπα, με καθαρές κατηγορίες και μάρκες, ώστε οι πελάτες να βρίσκουν αυτό που ψάχνουν.',
        'ph.whyTitle': 'τι κερδίζετε',
        'ph.w1': 'Ο πελάτης εμπιστεύεται μια σελίδα που απαντά στις ερωτήσεις του, και αγοράζει πιο εύκολα.',
        'ph.w2': 'Λιγότερα τηλέφωνα με την ερώτηση «αυτό για τι είναι;»',
        'ph.w3': 'Περισσότερες πιθανότητες να σας βρίσκουν στο Google.',
        'ph.w4': 'Αρχεία έτοιμα για το e-shop σας, το σύστημά σας ή μια εφαρμογή delivery.',
        'ph.howTitle': 'πώς δουλεύουμε',
        'ph.s1Title': 'Μου στέλνετε τη λίστα προϊόντων',
        'ph.s1Text': 'Αρκεί ένα αρχείο Excel από το σύστημά σας, ακόμα κι αν τα ονόματα είναι μπερδεμένα.',
        'ph.s2Title': 'Ετοιμάζω τα προϊόντα',
        'ph.s2Text': 'Περιγραφές, φωτογραφίες, συστατικά και κατηγορίες, ελεγμένα ένα προς ένα.',
        'ph.s3Title': 'Τα παίρνετε έτοιμα',
        'ph.s3Text': 'Αρχεία έτοιμα για το e-shop σας, ή τα περνάω απευθείας στο σύστημά σας.',
        'ph.proof': 'Το κάνω ήδη για φαρμακεία στην Κύπρο: χιλιάδες προϊόντα έτοιμα για τα e-shops και τις εφαρμογές delivery τους.',
        'ph.remote': 'Δουλεύω εξ αποστάσεως, οπότε δεν έχει σημασία πού βρίσκεται το φαρμακείο σας. Μιλάω ελληνικά, αγγλικά και ρωσικά.',
        'ph.cta': 'ας μιλήσουμε για το φαρμακείο σας',

        'about.title': 'σχετικά με μένα',
        'about.p1': 'Είμαι φοιτήτρια Επιστήμης Υπολογιστών και ζω στη <strong>Λεμεσό, στην Κύπρο</strong>. Η διαδρομή μου στην τεχνολογία είναι λίγο διαφορετική: παράλληλα με τις σπουδές μου δούλεψα σε <strong>φαρμακείο</strong> και στο <strong>e&#8209;commerce</strong>, οπότε ξέρω πώς λειτουργεί στην πράξη μια επιχείρηση κάθε μέρα, όχι μόνο πώς να γράφω κώδικα γι’ αυτήν.',
        'about.p2': 'Μεγάλο μέρος της δουλειάς μου είναι τα δεδομένα προϊόντων: καθαρισμός καταλόγων, αντιστοίχιση barcodes, οργάνωση χιλιάδων κωδικών (SKU) σε υπολογιστικά φύλλα και σε σύστημα ERP. Έμαθα να δίνω σημασία στην ακρίβεια και στη μικρή λεπτομέρεια που χαλάει αθόρυβα τα πάντα αν δεν την ελέγξει κανείς.',
        'about.p3': 'Έχω επίσης δίπλωμα <strong>Τεχνικού Η/Υ και Δικτύων</strong> και το επεκτείνω με δουλειά στα δεδομένα και στην κυβερνοασφάλεια. Μιλάω <strong>αγγλικά, ρωσικά και ελληνικά</strong>, κάτι που βοηθάει πολύ σε κάθε ρόλο που έχει επαφή με ανθρώπους.',
        'about.basedIn': 'βάση',
        'about.city': 'Λεμεσός, Κύπρος',
        'about.speaks': 'μιλάω',

        'journey.title': 'διαδρομή',
        'journey.tab1': 'φαρμακείο',
        'journey.tab2': 'e-commerce',
        'journey.tab3': 'σπουδές',
        'journey.tab4': 'τι ακολουθεί',
        'journey.h1': 'φαρμακείο <span class="accent">@ Λεμεσός</span>',
        'journey.p1.1': 'Εξυπηρετούσα πελάτες κάθε μέρα, σε τρεις γλώσσες.',
        'journey.p1.2': 'Έμαθα πώς κινούνται πραγματικά τα προϊόντα, το απόθεμα και οι προμηθευτές σε μια επιχείρηση.',
        'journey.p1.3': 'Συνήθισα σε μια δουλειά όπου ένα μικρό λάθος μετράει πραγματικά.',
        'journey.h2': 'e-commerce <span class="accent">@ ηλεκτρονικά φαρμακεία</span>',
        'journey.p2.1': 'Διαχειρίζομαι καταλόγους με χιλιάδες κωδικούς σε Excel και σε σύστημα ERP.',
        'journey.p2.2': 'Αντιστοιχίζω barcodes, καθαρίζω δεδομένα προϊόντων και κρατάω σωστά το απόθεμα και τις κατηγορίες.',
        'journey.p2.3': 'Ετοιμάζω καταχωρίσεις για πλατφόρμες delivery και για τα sites των καταστημάτων.',
        'journey.h3': 'επιστήμη υπολογιστών <span class="accent">@ πανεπιστήμιο</span>',
        'journey.p3.1': 'Δίπλωμα Τεχνικού Η/Υ και Δικτύων.',
        'journey.p3.2': 'Προγραμματισμός σε Python, C++ και JavaScript, καθώς και βάσεις δεδομένων και δίκτυα.',
        'journey.p3.3': 'Ομαδικό project: UniVerse, ένα σύστημα έξυπνης πανεπιστημιούπολης με Flask και MySQL.',
        'journey.p3.4': 'Πτυχιακή εργασία για τη χρήση AI στον εμπλουτισμό καταλόγων προϊόντων για κυπριακά φαρμακεία.',
        'journey.h4': 'τι ακολουθεί <span class="accent">@ ?</span>',
        'journey.p4.1': 'Ψάχνω θέση junior στα δεδομένα, στην IT υποστήριξη ή στα συστήματα e-commerce.',
        'journey.p4.2': 'Αυτή την περίοδο μαθαίνω κυβερνοασφάλεια και θέλω να χτίσω την καριέρα μου εκεί.',

        'skills.title': 'δεξιότητες',
        'skills.systems': 'συστήματα',
        'skills.networking': 'δίκτυα',
        'skills.hardware': 'hardware &amp; απομακρυσμένη πρόσβαση',
        'skills.programming': 'προγραμματισμός',
        'skills.data': 'δεδομένα',
        'skills.tools': 'εργαλεία &amp; άνθρωποι',
        'tag.accounts': 'Λογαριασμοί χρηστών',
        'tag.backups': 'Αντίγραφα ασφαλείας',
        'tag.troubleshooting': 'Επίλυση προβλημάτων',
        'tag.vlans': 'VLANs &amp; υποδίκτυα',
        'tag.pcBuilding': 'Συναρμολόγηση PC',
        'tag.hwBasics': 'Βασικές γνώσεις hardware',
        'tag.excel': 'Excel (προχωρημένο)',
        'tag.datasets': 'Δεδομένα προϊόντων',
        'tag.cleaning': 'Καθαρισμός δεδομένων',
        'tag.bulk': 'Μαζικός αυτοματισμός',
        'tag.support': 'Υποστήριξη σε EN · RU · GR',
        'tag.problems': 'Λύση προβλημάτων',

        'projects.title': 'projects',
        'projects.featuredLabel': 'ξεχωριστό · αυτό το site',
        'projects.p1Title': 'προσωπικό portfolio, από το μηδέν',
        'projects.p1Desc': 'Το site που βλέπεις τώρα. HTML, CSS και JavaScript γραμμένα με το χέρι, χωρίς frameworks. Το πορτρέτο στην κορυφή είναι ένα μικρό canvas script που έγραψα μόνη μου: με σχεδιάζει από 0 και 1, ακολουθεί το ποντίκι σου και σκορπίζει όταν κάνεις κλικ. Έχει φωτεινό και σκοτεινό θέμα, τρεις γλώσσες, και προσαρμόζεται σε κάθε μέγεθος οθόνης.',
        'projects.groupLabel': 'ομαδικό project',
        'projects.p2Title': 'universe: σύστημα έξυπνου campus',
        'projects.p2Desc': 'Web εφαρμογή για τη λειτουργία μιας πανεπιστημιούπολης: κράτηση αιθουσών, ρόλοι χρηστών, καταγραφή παρουσιών και λειτουργίες για φοιτητές και προσωπικό. Backend σε Flask, βάση δεδομένων MySQL, πρόσβαση ανά ρόλο και ιδέα για παρουσίες με NFC.',
        'projects.studentLabel': 'φοιτητικό project',
        'projects.p3Desc': 'Front-end εφαρμογή σε JavaScript για περιήγηση και εργασία με δεδομένα βιβλίων και βιβλιοθήκης, μέσα από ένα απλό και καθαρό περιβάλλον.',

        'contact.title': 'πες ένα γεια',
        'contact.big': 'Έχεις μια θέση, ένα project ή απλώς μια ερώτηση; <span class="accent">Το inbox μου είναι ανοιχτό.</span>',
        'contact.copyHint': 'κλικ για αντιγραφή',
        'contact.copied': 'αντιγράφηκε ✓',
        'contact.send': 'στείλε email',
        'contact.call': 'τηλέφωνο',
        'contact.cv': 'βιογραφικό (cv)',

        'footer.built': 'σχεδιασμένο &amp; φτιαγμένο από το μηδέν από τη viola',
        'footer.city': 'λεμεσός, κύπρος',

        'aria.lang': 'Επιλογή γλώσσας',
        'aria.theme': 'Αλλαγή φωτεινού ή σκοτεινού θέματος',
        'aria.menu': 'Άνοιγμα μενού',
        'aria.milestones': 'Σταθμοί καριέρας',
        'aria.source': 'Κώδικας στο GitHub',
    },

    ru: {
        'nav.about': 'обо мне',
        'nav.journey': 'путь',
        'nav.skills': 'навыки',
        'nav.projects': 'проекты',
        'nav.contact': 'контакты',

        'hero.title': 'лучшие данные о товарах<br> <span class="accent">для интернет&#8209;аптек</span>',
        'hero.desc': 'Студентка Computer Science. Параллельно с учёбой я работала в аптеке и в e-commerce, поэтому мне нравится создавать то, что упрощает работу с реальными данными.',
        'hero.focused': 'в фокусе →',
        'hero.roles': ['очистка данных', 'обогащение каталогов', 'linux', 'IT-поддержка', 'кибербезопасность'],
        'hero.sayHi': 'написать мне',
        'hero.seeProjects': 'мои проекты',
        'hero.hint': 'наведите мышь · кликните, чтобы рассыпать',
        'hero.hintTouch': 'нажмите, чтобы рассыпать',

        'nav.pharmacies': 'для аптек',
        'ph.title': 'для аптек',
        'ph.big': 'Ваши товары заслуживают большего, чем название и цена. <span class="accent">Я готовлю их к продаже онлайн.</span>',
        'ph.intro': 'Открываете интернет-магазин или выходите на Wolt или другое приложение доставки? В большинстве аптечных систем есть только короткое название, штрихкод и цена. Покупателю онлайн нужно гораздо больше, прежде чем он решится на покупку. Я подготовлю всё это за вас, товар за товаром, чтобы ваши полки выглядели онлайн так же хорошо, как в самой аптеке.',
        'ph.c1Title': 'Понятные описания',
        'ph.c1Text': 'Что это за товар, кому он подходит и чем помогает — так, чтобы покупатель понял это за несколько секунд.',
        'ph.c2Title': 'Правильные фото',
        'ph.c2Text': 'Чистые, единообразные фотографии для каждого товара, сверенные по штрихкоду, чтобы на фото всегда был нужный товар, объём и оттенок.',
        'ph.c3Title': 'Состав и применение',
        'ph.c3Text': 'Полный состав, активные компоненты, способ применения и предупреждения — по официальной информации бренда.',
        'ph.c4Title': 'Порядок в каталоге',
        'ph.c4Text': 'Правильные названия и объёмы, без дублей, с понятными категориями и брендами, чтобы покупатели легко находили нужное.',
        'ph.whyTitle': 'что вы получаете',
        'ph.w1': 'Покупатель доверяет карточке, которая отвечает на его вопросы, и покупает охотнее.',
        'ph.w2': 'Меньше звонков с вопросом «а это для чего?»',
        'ph.w3': 'Больше шансов, что вас найдут в Google.',
        'ph.w4': 'Файлы, готовые для вашего интернет-магазина, вашей системы или приложения доставки.',
        'ph.howTitle': 'как мы работаем',
        'ph.s1Title': 'Вы присылаете список товаров',
        'ph.s1Text': 'Достаточно выгрузки в Excel из вашей системы, даже если названия в беспорядке.',
        'ph.s2Title': 'Я готовлю товары',
        'ph.s2Text': 'Описания, фото, состав и категории, проверенные по одному.',
        'ph.s3Title': 'Вы получаете готовый результат',
        'ph.s3Text': 'Файлы для вашего интернет-магазина, или я сама вношу всё в вашу систему.',
        'ph.proof': 'Я уже делаю это для аптек на Кипре: тысячи товаров, подготовленных для их интернет-магазинов и приложений доставки.',
        'ph.remote': 'Я работаю удалённо, поэтому неважно, где находится ваша аптека. Говорю на греческом, английском и русском.',
        'ph.cta': 'обсудить вашу аптеку',

        'about.title': 'обо мне',
        'about.p1': 'Я студентка Computer Science, живу в <strong>Лимассоле, на Кипре</strong>. Мой путь в IT немного необычный: параллельно с учёбой я работала в <strong>аптеке</strong> и в <strong>e&#8209;commerce</strong>, поэтому знаю, как бизнес на самом деле работает изо дня в день, а не только как писать для него код.',
        'about.p2': 'Большая часть моей работы — данные о товарах: чистка каталогов, сверка штрихкодов, организация тысяч SKU в таблицах и ERP-системе. Это научило меня ценить точность и замечать мелочи, которые незаметно ломают всё, если их никто не проверит.',
        'about.p3': 'У меня также есть диплом <strong>техника по компьютерам и сетям</strong>, и я развиваюсь дальше — в работе с данными и в кибербезопасности. Я говорю на <strong>английском, русском и греческом</strong>, и это очень помогает в любой работе с людьми.',
        'about.basedIn': 'город',
        'about.city': 'Лимассол, Кипр',
        'about.speaks': 'языки',

        'journey.title': 'мой путь',
        'journey.tab1': 'аптека',
        'journey.tab2': 'e-commerce',
        'journey.tab3': 'учёба',
        'journey.tab4': 'что дальше',
        'journey.h1': 'аптека <span class="accent">@ Лимассол</span>',
        'journey.p1.1': 'Каждый день работала с клиентами на трёх языках.',
        'journey.p1.2': 'Узнала, как на самом деле движутся товары, запасы и поставки внутри бизнеса.',
        'journey.p1.3': 'Привыкла к работе, где даже маленькая ошибка имеет значение.',
        'journey.h2': 'e-commerce <span class="accent">@ онлайн-аптеки</span>',
        'journey.p2.1': 'Веду каталоги с тысячами SKU в Excel и ERP-системе.',
        'journey.p2.2': 'Сверяю штрихкоды, чищу данные о товарах и слежу, чтобы остатки и категории были верными.',
        'journey.p2.3': 'Готовлю карточки товаров для платформ доставки и сайтов магазинов.',
        'journey.h3': 'computer science <span class="accent">@ университет</span>',
        'journey.p3.1': 'Диплом техника по компьютерам и сетям.',
        'journey.p3.2': 'Программирование на Python, C++ и JavaScript, а также базы данных и сети.',
        'journey.p3.3': 'Групповой проект: UniVerse — система «умного кампуса» на Flask и MySQL.',
        'journey.p3.4': 'Дипломная работа о том, как ИИ может обогащать каталоги товаров для кипрских аптек.',
        'journey.h4': 'что дальше <span class="accent">@ ?</span>',
        'journey.p4.1': 'Ищу junior-позицию в сфере данных, IT-поддержки или e-commerce систем.',
        'journey.p4.2': 'Сейчас изучаю кибербезопасность и хочу строить карьеру в этой области.',

        'skills.title': 'навыки',
        'skills.systems': 'системы',
        'skills.networking': 'сети',
        'skills.hardware': 'железо и удалённый доступ',
        'skills.programming': 'программирование',
        'skills.data': 'данные',
        'skills.tools': 'инструменты и люди',
        'tag.accounts': 'Учётные записи',
        'tag.backups': 'Резервное копирование',
        'tag.troubleshooting': 'Устранение неполадок',
        'tag.vlans': 'VLAN и подсети',
        'tag.pcBuilding': 'Сборка ПК',
        'tag.hwBasics': 'Основы железа',
        'tag.excel': 'Excel (продвинутый)',
        'tag.datasets': 'Данные о товарах',
        'tag.cleaning': 'Очистка данных',
        'tag.bulk': 'Массовая автоматизация',
        'tag.support': 'Поддержка на EN · RU · GR',
        'tag.problems': 'Решение проблем',

        'projects.title': 'проекты',
        'projects.featuredLabel': 'главное · этот сайт',
        'projects.p1Title': 'личное портфолио с нуля',
        'projects.p1Desc': 'Сайт, который вы сейчас смотрите. HTML, CSS и JavaScript написаны вручную, без фреймворков. Портрет наверху — небольшой canvas-скрипт, который я написала сама: он рисует меня из нулей и единиц, следует за мышью и рассыпается по клику. Есть светлая и тёмная тема, три языка, а вёрстка подстраивается под любой экран.',
        'projects.groupLabel': 'групповой проект',
        'projects.p2Title': 'universe: система умного кампуса',
        'projects.p2Desc': 'Веб-приложение для управления университетским кампусом: бронирование аудиторий, роли пользователей, учёт посещаемости и функции для студентов и сотрудников. Бэкенд на Flask, база данных MySQL, доступ по ролям и идея отметки посещаемости через NFC.',
        'projects.studentLabel': 'учебный проект',
        'projects.p3Desc': 'Фронтенд-приложение на JavaScript для просмотра данных о книгах и библиотеке и работы с ними через простой и аккуратный интерфейс.',

        'contact.title': 'напишите мне',
        'contact.big': 'Есть вакансия, проект или просто вопрос? <span class="accent">Пишите, я на связи.</span>',
        'contact.copyHint': 'нажмите, чтобы скопировать',
        'contact.copied': 'скопировано ✓',
        'contact.send': 'написать письмо',
        'contact.call': 'позвонить',
        'contact.cv': 'скачать резюме',

        'footer.built': 'дизайн и код с нуля — viola',
        'footer.city': 'лимассол, кипр',

        'aria.lang': 'Выбрать язык',
        'aria.theme': 'Переключить светлую или тёмную тему',
        'aria.menu': 'Открыть меню',
        'aria.milestones': 'Этапы карьеры',
        'aria.source': 'Исходный код на GitHub',
    },
};

/* Short labels for the button in the navbar */
const langLabels = { en: 'EN', el: 'GR', ru: 'RU' };

/* On phones and tablets the canvas hint should talk about tapping */
if (window.matchMedia('(hover: none)').matches) {
    document.querySelector('.hero-art-hint').dataset.i18n = 'hero.hintTouch';
}

/* Remember the English text that is written in index.html */
const textElements = document.querySelectorAll('[data-i18n]');
const ariaElements = document.querySelectorAll('[data-i18n-aria]');
textElements.forEach(el => {
    translations.en[el.dataset.i18n] ??= el.innerHTML.trim();
});
ariaElements.forEach(el => {
    translations.en[el.dataset.i18nAria] = el.getAttribute('aria-label');
});

let currentLang = 'en';

/* Look up one string; falls back to English if a key is missing */
function t(key) {
    return translations[currentLang][key] ?? translations.en[key];
}

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    document.documentElement.lang = lang;

    textElements.forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    ariaElements.forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });

    document.getElementById('langCurrent').textContent = langLabels[lang];
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
}

/* Which language to start with: ?lang= in the link, then the saved
   choice, then the visitor's browser language, then English */
function startLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (translations[fromUrl]) return fromUrl;

    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) { /* ignore */ }
    if (translations[saved]) return saved;

    const browser = (navigator.language || 'en').slice(0, 2); // "el-GR" -> "el"
    return translations[browser] ? browser : 'en';
}

setLanguage(startLanguage());

/* ---------- The dropdown menu ---------- */
const langSwitch = document.getElementById('langSwitch');
const langToggle = document.getElementById('langToggle');

function closeLangMenu() {
    langSwitch.classList.remove('open');
    langToggle.setAttribute('aria-expanded', 'false');
}

langToggle.addEventListener('click', e => {
    e.stopPropagation(); // otherwise the document click below closes it again
    const isOpen = langSwitch.classList.toggle('open');
    langToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
        closeLangMenu();
    });
});

/* Click anywhere else or press Escape to close the menu */
document.addEventListener('click', closeLangMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLangMenu(); });

/* script.js uses i18n.t() for the strings it writes itself */
window.i18n = { t };
