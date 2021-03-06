'use strict';

//Curie calculate the probability of data given
let newton = require( 'bindings' )( 'newton' );
let Riemann = require( '../Riemann/riemann' );
let pcamodel
let debug = require( '../debug' )
let statsmodel
let p_x = newton.p_x;
let uprade_pca = require( '../Darwin/darwin' ).pca_sample;



let Pca_analytic = function ( timeupgrade, sizesample, options, config ) {
  if ( typeof sizesample === 'object' ) {
    options = sizesample
    sizesample = undefined
  } else if ( typeof timeupgrade === 'object' ) {
    options = timeupgrade
    timeupgrade = undefined
  }
  let Pca_analysis = function ( V_matrix, S_vector, _stats ) {
    this.V = V_matrix;
    this.S = S_vector;
    this.stats = _stats;
    this.p_x = ( function ( analytic ) {
      try {
        return p_x( this.V, analytic, this.S, this.stats );
      } catch ( e ) {
        debug.Curie.error( 'error on p_x:', e )
      }

    } ).bind( this );

  };
  pcamodel = Riemann.modelof_pca_system;
  statsmodel = Riemann.Modelstats;
  this.pca_lets = {
    V_T: [ ],
    S: [ ],
    stats: [ ]
  };
  //if the time arguments is passed the upgrade methos is exec
  this.timeupgrade = timeupgrade || 30000;
  this.sizesample = sizesample || 10000
  this.options = options || {
    conditions: {}
  }
  this.config = config || {}

  let _this = this;
  // the upgrade method
  this.upgrade = function ( timeupgrade, sizesample, options ) {
    if ( timeupgrade ) {
      _this.timeupgrade = timeupgrade;
    }
    if ( sizesample ) {
      _this.sizesample = sizesample;
    }
    if ( options ) {
      _this.options = options;
    }

    uprade_pca( _this.timeupgrade, _this.sizesample, _this.options, _this.config );
  };

  this.stop = function ( ) {
    uprade_pca.stop( );
  };
  // the callback receive the p_x function as argument.
  this.pca = function ( cb ) {
    statsmodel.findOne( _this.options.conditions, function ( err, stats ) {
      if ( err || !stats ) {
        debug.Curie.error( 'error to find stats:', err )
      }
      if ( stats ) {
        debug.Curie.info( 'the stats found was:', stats )
        _this.pca_lets.stats = [ stats.media, stats.sigma ];
        pcamodel.findOne( _this.options.conditions, function ( error,
          pca ) {
          if ( pca ) {
            _this.pca_lets.V_T = pca.V_T_matrix;
            _this.pca_lets.S = pca.S_vector;
            pca = new Pca_analysis( _this.pca_lets.V_T, _this.pca_lets
              .S, _this.pca_lets.stats );
            cb( pca.p_x );
          }

        } );
      }
    } );
  };
};



module.exports = Pca_analytic;