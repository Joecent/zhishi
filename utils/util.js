const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

const buildQueryString = function( data ) { 
    // If this is not an object, defer to native stringification.           
    var buffer = [];            
    // Serialize each key in the object.
    for ( var name in data ) { 
        if ( ! data.hasOwnProperty( name ) ) { 
            continue; 
        }            
        var value = data[ name ];            
        buffer.push(
            encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
        ); 
    }            
    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join( "&" ).replace( /%20/g, "+" ); 
    return( source ); 
};

const isEmptyJson = function(data) {
    let flag = 0;
    for(let key in data) flag++;
    return flag === 0;
};

module.exports = {
	formatTime: formatTime,
    buildQueryString: buildQueryString,
    isEmptyJson: isEmptyJson
};
