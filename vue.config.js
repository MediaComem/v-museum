module.exports = {
    devServer: {
        proxy: {
            "^/api/items": {
                target: 'https://v-museum.heig-vd.ch/',
            }
            
        }
    }
}