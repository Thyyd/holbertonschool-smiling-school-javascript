$(document).ready(function() { //Vérifie si le jQuerry est disponible
    function createQuotesCarousel()
    {
        const carouselParent = $(".quotes .carousel-inner");
        const carouselContainer = $("#quotes-carousel");
        carouselParent.empty(); // Supprime les enfants de carouselParent SI JAMAIS on rapelle la fonction (Vu qu'au départ, elle est vide).

        displayLoading(true, "#quotes-carousel");

        $.ajax({ // Requête ajax
            type: "GET", // Requête GET
            url: "https://smileschool-api.hbtn.info/quotes", // Requête à l'API
            success: function (response) { // S'effectue uniquement si la requête réussit
                response.forEach(function (result, index) { // Pour chaque élément, affiche un nouvel élément au carousel
                    const carouselElement = $("<div></div>").attr({class: "carousel-item"})
                                                            .toggleClass("active", index === 0); // Ajoute la classe .active si index === 0, soit pour le premier élément
                    carouselElement.append(
                        $("<div></div>").attr({class: "row mx-auto align-items-center"}).append(
                            $("<div></div>").attr({class: "col-12 col-sm-2 col-lg-2 offset-lg-1 text-center"}).append(
                                $("<img>").attr({class: "d-block align-self-center", alt: "Carousel Pic " + result.id, src: result.pic_url})
                            ),
                            $("<div></div>").attr({class: "col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0"}).append(
                                $("<div></div>").attr({class: "quote-text"}).append(
                                    $("<p></p>").attr({class: "text-white"}).text(result.text),
                                    $("<h4></h4>").attr({class: "text-white font-weight-bold"}).text(result.name),
                                    $("<span></span>").attr({class: "text-white"}).text(result.title)
                                )
                            )
                        )
                    )
                    carouselParent.append(carouselElement);
                });
                carouselContainer.append(
                    $("<a></a>").attr({
                        class: "carousel-control-prev arrow-left",
                        href: "#quotes-carousel",
                        role: "button",
                        "data-slide":"prev"
                    }).append(
                        $("<img>").attr({
                            src: "images/arrow_white_left.png",
                            alt: "Quote Previous",
                            "aria-hidden": "true"
                        }),
                        $("<span></span>").addClass("sr-only").text("Previous")
                    ),
                    $("<a></a>").attr({
                        class: "carousel-control-next arrow-right",
                        href: "#quotes-carousel",
                        role: "button",
                        "data-slide":"next"
                    }).append(
                        $("<img>").attr({
                            src: "images/arrow_white_right.png",
                            alt: "Quote Next",
                            "aria-hidden": "true"
                        }),
                        $("<span></span>").addClass("sr-only").text("Next")
                    )
                )
                displayLoading(false, "#quotes-carousel");
            },
                error: function () {
                displayLoading(false, "#quotes-carousel");
                alert("Erreur lors du chargement des données");
            }
        });
    }

    function createCards(result)
    {
        // Création de la div contenant les étoiles, car impossibilité d'utiliser des for dans des append.
        let $divStars = $("<div>", { class: "rating d-flex" });
        for(let i = 0; i < result.star; i++)
        {
            $divStars.append($("<img>").attr({alt: "star on", width:"15px", height:"15px", src: "images/star_on.png"}));
        }
        for(let j = 0; j < 5 - result.star; j++)
        {
            $divStars.append($("<img>").attr({alt: "star off", width:"15px", height:"15px", src: "images/star_off.png"}));
        }

        // Création d'une card
        const card = $("<div></div>").attr({class: "card"}).append(
            $("<div></div>").attr({class: "card-img-wrapper"}).append(
                $("<img>").attr({class: "card-img-top", alt: "Video thumbnail", src: result.thumb_url}),
                $("<div></div>").attr({class: "play-overlay-container text-center"}).append(
                    $("<img>").attr({class: "play-overlay", alt: "Play", width:"64px", src: "images/play.png"})
                ),
            ),
            $("<div></div>").attr({class: "card-body"}).append(
                $("<h5></h5>").attr({class: "card-title font-weight-bold"}).text(result.title),
                $("<p></p>").attr({class: "card-text text-muted"}).text(result["sub-title"]), // Crochets obligatoires car nom d'attribut utilise un '-'
                $("<div></div>").attr({class: "creator d-flex align-items-center"}).append(
                    $("<img>").attr({class: "rounded-circle", alt: "Creator of Video", width:"30px", src: result.author_pic_url}),
                    $("<h6></h6>").attr({class: "pl-3 m-0 main-color"}).text(result.author)
                ),
                $("<div></div>").attr({class: "info pt-3 d-flex justify-content-between"})
                .append($divStars,
                    $("<span></span>").attr({class: "main-color"}).text(result.duration)),
            )
        )

        return(card)
    }

    function createVideosCarousel(url, selector)
    {
        const carouselParent = $(selector);

        // Si slick a déjà été initialisé, on le détruit pour évite un bug si la fonction est appeléee plusieurs fois
        if (carouselParent.hasClass("slick-initialized")) {
            carouselParent.slick("unslick");
        }

        carouselParent.empty(); // Supprime les enfants de carouselParent SI JAMAIS on rapelle la fonction (Vu qu'au départ, elle est vide).

        displayLoading(true, selector);

        $.ajax({ // Requête ajax
            type: "GET", // Requête GET
            url: url, // Requête à l'API
            success: function (response) { // S'effectue uniquement si la requête réussit
                response.forEach(function (result) { // Pour chaque élément, affiche un nouvel élément au carousel

                    // Création de la div col à l'intérieur du carousel, correspondant à une slide
                    const col = $("<div></div>").attr({class: "d-flex justify-content-center"})

                    col.append(createCards(result));
                    carouselParent.append(col);
                });
                displayLoading(false, selector);

                carouselParent.slick(
                {
                    slidesToShow: 4, // Display de 4 cards
                    slidesToScroll: 1, // Déplacement d'une card par une card
                    infinite: true, // Quand le carousel arrive à la fin, il recommence automatiquement au début
                    arrows: true, // Boutons précédent et suivant
                    prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><img src="images/arrow_black_left.png" alt="Previous" aria-hidden="true" /></button>',
                    nextArrow: '<button type="button" class="slick-next" aria-label="Next"><img src="images/arrow_black_right.png" alt="Next" aria-hidden="true"></button>',
                    autoplay: true, // Le carousel défile automatiquement
                    autoplaySpeed: 5000, // Toutes les 5 secondes (5000 ms)
                    responsive: [
                        {
                            breakpoint: 992, // Inférieur à 992px
                            settings: {
                                slidesToShow: 2 // Display de 2 cards seulement en display medium (Bootstrap)
                            }
                        },
                        {
                            breakpoint: 576, // Inférieur à 576px
                            settings: {
                                slidesToShow: 1 // Display d'une seule card en display small (Bootstrap)
                            }
                        }
                    ]
                });
            },
                error: function () {
                displayLoading(false, selector);
                alert("Erreur lors du chargement des données");
            }
        });
    }

    function displayLoading(loading, selector)
    {
        const divload = $(selector);

        if (loading === true)
        {
            if (!divload.parent().hasClass("loading")) // Si la divload n'a pas de parent dont la classe est loading
            {
                divload.wrap("<div class='loading'></div>"); // Wrap la div dans une div de classe loading
            }
        }
        else
        {
            if (divload.parent().hasClass("loading")) // Si la divload a un parent dont la classe est loading
            {
                divload.unwrap(); // Retire la div
            }
        }
    }


    // Courses Part


    // Initialisation des variables d'état
    let currentQ = "";
    let currentTopic = "";
    let currentSort = "";
    const $searchInput = $("#search-keyword");


    // Fonction qui remplace les "_" par des " " et met des majuscules aux premières lettres sur la page HTML
    function formatLabel(value) {
        return value
            .replaceAll("_", " ")
            .replace(/\b\w/g, l => l.toUpperCase())
    }


    // Fonction qui créé le menu dropDown
    function generateDropdown({containerSelector, id, label, selectedValue, items, itemClass})
    {
        const container = $(containerSelector)
        container.empty()

        // Title
        const title = $("<span>")
            .addClass("text-white font-weight-bold drop-down-title")
            .text(label)

        // div .dropdown
        const dropdownDiv = $("<div>")
            .addClass("dropdown")

        // Button
        const button = $("<a>")
            .addClass("btn dropdown-toggle text-left")
            .attr({
                href: "#",
                role: "button",
                id: id,
                "data-toggle": "dropdown",
                "aria-haspopup": "true",
                "aria-expanded": "false"
            })
        const buttonSpan = $("<span>").text(formatLabel(selectedValue))

        button.append(buttonSpan) // Ajout du span comme valeur à la balise a

        // Menu
        const menu = $("<div>")
            .addClass("dropdown-menu mt-0")
            .attr("aria-labelledby", id)

        // Items
        items.forEach(item => {
            const menuItem = $("<a>")
                .addClass(`dropdown-item ${itemClass}`)
                .attr("href", "#")
                .attr("data-value", item)
                .text(formatLabel(item))

            menu.append(menuItem)
        })


        dropdownDiv.append(button) // Ajout de la balise a à la div de classe .dropdown
        dropdownDiv.append(menu) // Ajout de la div de classe .dropdown-menu mt-0 à la div de classe .dropdown

        container.append(title) // Ajout du span à la div .box
        container.append(dropdownDiv) // Ajout de la div de classe .dropdown à la div .box

        return(container)
    }

    function loadCourses(q, topic, sort)
    {
        $("#courses-results").empty(); // Supprime les enfants de #courses_result SI JAMAIS on rapelle la fonction (Vu qu'au départ, elle est vide).
        displayLoading(true, $("#courses-results"));

        $.ajax({
        type: "GET",
        url: "https://smileschool-api.hbtn.info/courses",
        data: {
            q: q,
            topic: topic,
            sort: sort
        },
        success: function(response) {
            currentQ = response.q;
            currentTopic = response.topic;
            currentSort = response.sort;

            $searchInput.val(currentQ); // Initialisation de search value à la valeur de q dans l'API

            // Génération des dropdowns
            generateDropdown({
                containerSelector: ".box2",
                id: "courses-topic",
                label: "TOPIC",
                selectedValue: response.topic,
                items: response.topics,
                itemClass: "topic-item"
            })

            generateDropdown({
                containerSelector: ".box3",
                id: "courses-sort",
                label: "SORT BY",
                selectedValue: response.sort,
                items: response.sorts,
                itemClass: "sort-item"
            })

            // Génération des cards
            const $coursesCards = $("#courses-results"); // Ou .carousel-inner si tu as un carousel
            $coursesCards.empty(); // Vide l'ancien contenu

            response.courses.forEach(course => {
                const $divCol = $("<div>").addClass("col-12 col-sm-4 col-lg-3 d-flex justify-content-center");
                const $card = createCards(course); // Ta fonction réutilisée
                $divCol.append($card);
                $coursesCards.append($divCol);
            });
            const numberOfCards = response.courses.length;
            $(".video-count").text(`${numberOfCards} video${numberOfCards > 1 ? "s" : ""}`); // Remplace le texte du span

            displayLoading(false, $("#courses-results"));
        },
                error: function () {
                displayLoading(false, $("#courses-results"));
                alert("Erreur lors du chargement des données");
            }
        });
    }


    // Event Handlers

    // Event Keyword Search
    function handleKeywordSearch() {
        const newValue = $searchInput.val().trim();

        // On évite de relancer la requête si la valeur n'a pas changé
        if (newValue !== currentQ) {
            currentQ = newValue;
            loadCourses(currentQ, currentTopic, currentSort);
        }
    }

    // Déclenchement sur Enter
    $searchInput.on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault(); // évite soumission de formulaire et donc de recharger la page
            handleKeywordSearch();
            $(this).blur(); // retire le focus
        }
    });
    // Déclenchement quand on quitte le champ
    $searchInput.on("blur", function () {
        handleKeywordSearch();
    });


    // Event Topics filters
    $(document).on("click", ".topic-item", function (e) { // Utilisation de $(document) car le dropdown est généré dynamiquement et qu'on fait du .empty()
        e.preventDefault();

        const selectedText = $(this).text(); // texte affiché
        const selectedValue = $(this).data("value"); // valeur API

        const button = $(this).closest(".dropdown").find(".dropdown-toggle span").text(selectedText);

        currentTopic = selectedValue;

        loadCourses(currentQ, currentTopic, currentSort);
    });


    // Event Sorts filters
    $(document).on("click", ".sort-item", function (e) { // Utilisation de $(document) car le dropdown est généré dynamiquement et qu'on fait du .empty()
        e.preventDefault();

        const selectedText = $(this).text(); // texte affiché
        const selectedValue = $(this).data("value"); // valeur API

        const button = $(this).closest(".dropdown").find(".dropdown-toggle span").text(selectedText);

        currentSort = selectedValue;

        loadCourses(currentQ, currentTopic, currentSort);
    });

    loadCourses("", "all", "most_popular");

    createQuotesCarousel();
    createVideosCarousel("https://smileschool-api.hbtn.info/popular-tutorials", "#popular-carousel");
    createVideosCarousel("https://smileschool-api.hbtn.info/latest-videos", "#latest-carousel");
})