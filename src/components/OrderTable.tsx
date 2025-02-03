import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useEffect, useState } from 'react';
import { fetchOrders, openOrderModal } from '../services/supaService';

type OrderType = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  payment_status: string;
};

type Details = {
  "id": number;
  "customer_id": string;
  "total": number;
  "status": string;
  "created_at": string;
  "payment_method": string;
  "customer_name": string;
  "payment_status": string;
  "contact_zap": string;
  "contact_instagram": string;
  "data_entrega": string;
  "order_items": [
      {
          "id": number;
          "estoque": {
            "nome": string;
            "imagem": string;
          }
          "price": number;
          "estampa": string;
          "order_id": number;
          "quantity": number;
          "product_id": number;
      },
  ]
}

const ITEMS_PER_PAGE = 15;

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OrderTable() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<Details | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const { ordersData, count } = await fetchOrders(currentPage, ITEMS_PER_PAGE, statusFilter);
        setOrders(ordersData);
        setTotalOrders(count);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [currentPage, statusFilter]);

  const handleViewOrder = async (orderId: string) => {
    try {
      const details = await openOrderModal(parseInt(orderId));
      setOrderDetails(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      {/* Render Filters and Search UI */}
      <Box className="SearchAndFilters-tabletUp" sx={{ borderRadius: 'sm', py: 2, display: { xs: 'none', sm: 'flex' }, flexWrap: 'wrap', gap: 1.5 }}>
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for order</FormLabel>
          <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
        </FormControl>
        {/* Render additional filters */}
      </Box>
      {/* Render Orders Table */}
      <Sheet className="OrderTableContainer" variant="outlined" sx={{ width: '100%', borderRadius: 'sm', flexShrink: 1, overflow: 'auto', minHeight: 0 }}>
        <Table stickyHeader hoverRow>
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center' }}>Selecionar</th>
              <th>Código Pedido</th>
              <th>Data Solicitação</th>
              <th>Status Pedido</th>
              <th>Status Pagamento</th>
              <th>Cliente</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center' }}>
                  <Checkbox size="sm" />
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{new Date(row.created_at).toLocaleDateString('pt-BR')}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={{
                      Finalized: <CheckRoundedIcon />, Pending: <AutorenewRoundedIcon />, Cancelled: <BlockIcon />,
                    }[row.status]}
                    color={{ Pending: 'primary', Finalized: 'success', Cancelled: 'danger' }[row.status] as ColorPaletteProp}
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={{
                      Paid: <CheckRoundedIcon />, Refunded: <AutorenewRoundedIcon />, Cancelled: <BlockIcon />, Waiting: <AutorenewRoundedIcon />,
                    }[row.payment_status]}
                    color={{ Paid: 'success', Refunded: 'neutral', Cancelled: 'danger', Waiting: 'warning' }[row.payment_status] as ColorPaletteProp}
                  >
                    {row.payment_status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">CL</Avatar>
                    <div>
                      <Typography level="body-xs">{row.customer_name}</Typography>
                      <Typography level="body-xs">bilugeek@gmail.com</Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button" onClick={() => handleViewOrder(row.id)}>
                      Ver Pedido
                    </Link>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box className="Pagination-laptopUp" sx={{ pt: 2, gap: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Button size="sm" variant="outlined" color="neutral" startDecorator={<KeyboardArrowLeftIcon />} onClick={handlePrevious} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Typography level="body-sm">Página {currentPage} de {totalPages}</Typography>
        <Button size="sm" variant="outlined" color="neutral" endDecorator={<KeyboardArrowRightIcon />} onClick={handleNext} disabled={currentPage === totalPages}>
          Próximo
        </Button>
      </Box>
      {/* Order Details Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <ModalDialog aria-labelledby="order-details-modal" layout="center">
          <ModalClose onClick={handleCloseModal} />
          <Typography id="order-details-modal" gutterBottom>
            Detalhes do Pedido #{orderDetails?.id}
          </Typography>
          <Box key={Math.random()} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2}}>
            <Box key={Math.random()} sx={{ display: 'flex',height: '94px',  flexDirection: 'column', justifyContent: 'center', alignItems: 'start', mb: 2, padding: 1, border: 'solid', borderWidth: '1px', borderRadius: '7px' }}>
              <Typography>Data de Entrega:</Typography>
              <Typography>{orderDetails?.data_entrega}</Typography>
            </Box>
            <Box key={Math.random()} sx={{ display: 'flex',height: '94px',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 2, padding: 1, border: 'solid', borderWidth: '1px', borderRadius: '7px' }}>
              <Typography>Valor Total:</Typography>
              <Typography>R$ {orderDetails?.total.toFixed(2)}</Typography>
            </Box>
            <Box key={Math.random()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 2, padding: 1, border: 'solid', borderWidth: '1px', borderRadius: '7px' }}>
              <Typography>Contatos Cliente:</Typography>
              <Typography><InstagramIcon /> {' '} {orderDetails?.contact_instagram}</Typography>
              <Typography><WhatsAppIcon /> {' '} {orderDetails?.contact_zap}</Typography>
            </Box>
            
          </Box>
          {orderDetails?.order_items?.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: 1, border: 'solid', borderWidth: '1px', borderRadius: '7px'  }}>
              {item?.estoque?.imagem && <Avatar src={`https://fjvuonsifrxlrflwufde.supabase.co/storage/v1/object/public/produtos/Imagens/Estoque/${item.estoque.imagem}`} sx={{ mr: 2 }} />}
              <Box key={Math.random()} sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', width: '100%'}}>
                <Box key={Math.random()} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', padding: 1}}>
                  <Typography>Tipo Produto: </Typography>
                  <Typography>{item?.estoque?.nome}</Typography>
                </Box>
                <Box key={Math.random()} sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'start', alignItems: 'start',padding: 1}}>
                  <div>
                    <Typography>Quantidade: </Typography>
                    <Typography>{item?.quantity}</Typography>
                  </div>
                  <div>
                    <Typography>Valor: </Typography>
                    <Typography>R$ {item?.price.toFixed(2)}</Typography>
                  </div>
                  <div>
                    <Typography>Arte: </Typography>
                    <Typography><Button><a href={`https://fjvuonsifrxlrflwufde.supabase.co/storage/v1/object/public/produtos/Imagens/Estampas/${item?.estampa}`} target="_blank" 
                     rel="noopener noreferrer"> Ver Estampa  </a></Button></Typography>
                  </div>
                </Box>
              </Box>
            </Box>
          ))}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
