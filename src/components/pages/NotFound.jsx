import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const iconVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex items-center justify-center p-6 bg-surface-50"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          variants={iconVariants}
          animate="float"
          className="inline-block mb-8"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={48} className="text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold text-surface-900 mb-4 font-heading">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-surface-700 mb-4">
            {t('Página no encontrada')}
          </h2>
          <p className="text-surface-600 mb-8">
            {t('La página que buscas no existe')}
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              icon="Home"
              size="large"
              className="w-full"
            >
              {t('Volver al Panel')}
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              icon="ArrowLeft"
              size="large"
              className="w-full"
            >
              Página Anterior
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-surface-200">
            <p className="text-sm text-surface-500 mb-4">
              ¿Necesitas ayuda? Prueba estas opciones:
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="ghost"
                size="small"
                icon="Users"
                onClick={() => navigate('/clientes')}
              >
                Clientes
              </Button>
              <Button
                variant="ghost"
                size="small"
                icon="Package"
                onClick={() => navigate('/servicios')}
              >
                Servicios
              </Button>
              <Button
                variant="ghost"
                size="small"
                icon="MessageCircle"
                onClick={() => navigate('/soporte')}
              >
                Soporte
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;