var getType = function (type_name) {
    /* COVID MODEL is not used for demo ~~ too scary~~
    *  I decided to use PRODUCT MODE;
    *  It's important to adjust the initial 3D AR model's size
    */
    let COVID_MODELS = {
        '0': {
            modelFile: 'assets/covid_19/scene.gltf',
            modelscale_: 0.13, //0.12
            name: "Covid-19 Cluster",
            index: 0,
            initialScale: '0.13 0.13 0.13'
        },

        
        '1': {
            modelFile: 'assets/man_mask/scene.gltf',
            modelscale_: 0.8, //0.15
            name: "Individual Case - Quarantine",
            index: 1,
            initialScale: '0.8 0.8 0.8'
        },

        '2': {
            modelFile: 'assets/question_block/scene.gltf',
            modelscale_: 6.3,
            name: "Suspected - Need Investigation",
            index: 2,
            initialScale: '6.3 6.3 6.3'
        }
    };

    let PRODUCT_MODELS = {
        '0': {
            modelFile: 'assets/burger/scene.gltf',
            modelscale_: 0.75,  //1.8
            name: "HAMBURGER",
            index: 0,
            initialScale: '0.75 0.75 0.75'
        },

        '1': {
            modelFile: 'assets/toro_sushi/scene.gltf',
            modelscale_: 0.96,
            name: "SUSHI",
            index: 1,
            initialScale: '0.96 0.96 0.96'
        },

        '2': {
            modelFile: 'assets/fried_rice/scene.gltf',
            modelscale_: 12.7,
            name: "Fried Rice",
            index: 2,
            initialScale: '12.7 12.7 12.7'
        },

        '3': {
            modelFile: 'assets/cake_with_cherry/scene.gltf',
            modelscale_: 0.014,
            name: "Dessert",
            index: 3,
            initialScale: '0.014 0.014 0.014'
        }
    };

    const arrayCovidTypes = ['COVID_CLUSTER', 'INDIVIDUAL_CASE', 'SUSPECT_ALERT'];
    const arrayProductTypes = ['FAST_FOOD', 'ASIAN_FOOD', 'REFINED_FOOD', 'DESSERT'];

    if (arrayCovidTypes.indexOf(type_name) !== -1) {
        return COVID_MODELS;
    } else if (arrayProductTypes.indexOf(type_name) !== -1) {
        return PRODUCT_MODELS;
    }
}

var getTypeModel = function (type_name) {
    const TypeModels = getType(type_name);
    switch (type_name) {
        case 'COVID_CLUSTER':
            console.log('This is the COVID_CLUSTER');
            return TypeModels['0'];
        case 'INDIVIDUAL_CASE':
            console.log('This is the Invididual Case');
            return TypeModels['1'];
        case 'SUSPECT_ALERT':
            console.log('This is the SUSPECT_ALERT');
            return TypeModels['2'];
        case 'FAST_FOOD':
            console.log('This is the HAMBURGER');
            return TypeModels['0'];
        case 'ASIAN_FOOD':
            console.log('This is the SUSHI');
            return TypeModels['1'];
        case 'REFINED_FOOD':
            console.log('This is the FRIED RICE');
            return TypeModels['2'];
        case 'DESSERT':
            console.log('This is the DESSERT');
            return TypeModels['3'];

        default:
            console.log(`Sorry, There is no ${type_name}.`);
            break;
    }

}

let AComponents = [];